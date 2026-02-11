const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { EventEmitter } = require('events');
const ClaudeTeamWatcher = require('./watcher');
// Use in-memory storage (SQLite not compatible with Node v23)
const SurveillanceDB = require('./database-lite');
console.log('💾 Using in-memory storage (no persistence between restarts)');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const eventBus = new EventEmitter();

// Initialize database and watcher
const db = new SurveillanceDB();
const watcher = new ClaudeTeamWatcher(eventBus);

// Middleware
app.use(cors());
app.use(express.json());

// Track active sessions
const activeSessions = new Map();

// Event handlers
eventBus.on('team:update', (data) => {
  console.log(`📝 Team update: ${data.teamName}`);

  let sessionId = activeSessions.get(data.teamName);

  if (!sessionId && data.event === 'add') {
    // New team created
    sessionId = db.createSession(data.teamName, data.config);
    activeSessions.set(data.teamName, sessionId);

    // Add team members
    if (data.config.members) {
      data.config.members.forEach(member => {
        db.upsertAgent(
          sessionId,
          member.name,
          member.agentType || 'unknown',
          member.model || 'unknown'
        );
      });
    }

    db.logEvent(sessionId, 'team_created', data);
  }

  // Broadcast to all connected clients
  broadcast({
    type: 'team:update',
    data: {
      ...data,
      sessionId
    }
  });
});

eventBus.on('task:update', (data) => {
  console.log(`✅ Task update: ${data.teamName} - ${data.fileName}`);

  const sessionId = activeSessions.get(data.teamName);
  if (sessionId && data.task) {
    db.upsertTask(sessionId, data.task);
    db.logEvent(sessionId, 'task_updated', data);
  }

  broadcast({
    type: 'task:update',
    data: {
      ...data,
      sessionId
    }
  });
});

eventBus.on('message:new', (data) => {
  console.log(`💬 New message: ${data.teamName} - ${data.agentName}`);

  const sessionId = activeSessions.get(data.teamName);
  if (sessionId && data.messages && Array.isArray(data.messages)) {
    data.messages.forEach(msg => {
      if (msg.from && msg.content) {
        db.saveMessage(
          sessionId,
          msg.from,
          msg.to || data.agentName,
          typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
          msg.type || 'message'
        );
      }
    });
    db.logEvent(sessionId, 'message_received', data);
  }

  broadcast({
    type: 'message:new',
    data: {
      ...data,
      sessionId
    }
  });
});

// REST API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/teams', (req, res) => {
  try {
    const teams = watcher.getActiveTeams();

    // Enrich with session data
    const enrichedTeams = teams.map(team => {
      const sessionId = activeSessions.get(team.name);
      const session = sessionId ? db.getActiveSession(team.name) : null;

      return {
        ...team,
        sessionId,
        session
      };
    });

    res.json({ teams: enrichedTeams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/teams/:teamName', (req, res) => {
  try {
    const { teamName } = req.params;
    const teams = watcher.getActiveTeams();
    const team = teams.find(t => t.name === teamName);

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const sessionId = activeSessions.get(teamName);
    const session = sessionId ? db.getActiveSession(teamName) : null;

    // Use agents from live config.json instead of database
    const agents = team.config.members ? team.config.members.map(member => ({
      name: member.name,
      agent_type: member.agentType || 'unknown',
      model: member.model || 'unknown',
      status: 'active' // Default status
    })) : [];

    const tasks = sessionId ? db.getTasks(sessionId) : [];
    const messages = sessionId ? db.getMessages(sessionId) : [];
    const events = sessionId ? db.getEvents(sessionId, 50) : [];

    res.json({
      ...team,
      sessionId,
      session,
      agents,
      tasks,
      messages,
      events
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/history', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const sessions = db.getAllSessions(limit);

    // Enrich with tasks and agents
    const enrichedSessions = sessions.map(session => {
      const agents = db.getAgents(session.id);
      const tasks = db.getTasks(session.id);
      const messageCount = db.getMessages(session.id, 1000).length;

      return {
        ...session,
        config: session.config ? JSON.parse(session.config) : null,
        agents,
        tasks,
        messageCount
      };
    });

    res.json({ sessions: enrichedSessions });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/teams/:teamName/end', (req, res) => {
  try {
    const { teamName } = req.params;
    const { totalTokens } = req.body;

    const sessionId = activeSessions.get(teamName);
    if (sessionId) {
      db.endSession(sessionId, totalTokens || 0);
      activeSessions.delete(teamName);

      broadcast({
        type: 'session:ended',
        data: { teamName, sessionId }
      });

      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Active session not found' });
    }
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ error: error.message });
  }
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('🔌 New WebSocket connection');

  // Send current state to new client
  const teams = watcher.getActiveTeams();
  ws.send(JSON.stringify({
    type: 'initial:state',
    data: { teams }
  }));

  ws.on('close', () => {
    console.log('🔌 WebSocket connection closed');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Broadcast helper
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Start watcher
watcher.start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  watcher.stop();
  db.close();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 3847;
server.listen(PORT, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║   🔍 Claude Agent Team Surveillance Dashboard             ║');
  console.log('╠═══════════════════════════════════════════════════════════╣');
  console.log(`║   Server:     http://localhost:${PORT}                       ║`);
  console.log(`║   WebSocket:  ws://localhost:${PORT}                         ║`);
  console.log('║   Status:     🟢 Running                                   ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
});

module.exports = { app, server, wss };
