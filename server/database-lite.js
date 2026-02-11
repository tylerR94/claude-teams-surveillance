// Lite version: In-memory storage without SQLite dependency
// This version doesn't persist history across restarts

class SurveillanceDB {
  constructor() {
    this.sessions = [];
    this.agents = [];
    this.tasks = [];
    this.messages = [];
    this.events = [];
    this.nextId = {
      session: 1,
      agent: 1,
      task: 1,
      message: 1,
      event: 1
    };
    console.log('✅ Using in-memory storage (no persistence)');
  }

  initSchema() {
    // No-op for in-memory version
  }

  // Session methods
  createSession(teamName, config) {
    const session = {
      id: this.nextId.session++,
      team_name: teamName,
      started_at: new Date().toISOString(),
      ended_at: null,
      status: 'active',
      total_tokens: 0,
      config: JSON.stringify(config)
    };
    this.sessions.push(session);
    return session.id;
  }

  getActiveSession(teamName) {
    return this.sessions
      .filter(s => s.team_name === teamName && s.status === 'active')
      .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())[0];
  }

  endSession(sessionId, totalTokens = 0) {
    const session = this.sessions.find(s => s.id === sessionId);
    if (session) {
      session.ended_at = new Date().toISOString();
      session.status = 'completed';
      session.total_tokens = totalTokens;
    }
  }

  getAllSessions(limit = 50) {
    return this.sessions
      .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
      .slice(0, limit);
  }

  // Agent methods
  upsertAgent(sessionId, agentName, agentType, model) {
    const existing = this.agents.find(a => a.session_id === sessionId && a.name === agentName);

    if (existing) {
      existing.agent_type = agentType;
      existing.model = model;
      existing.status = 'active';
      return existing.id;
    } else {
      const agent = {
        id: this.nextId.agent++,
        session_id: sessionId,
        name: agentName,
        agent_type: agentType,
        model: model,
        status: 'active'
      };
      this.agents.push(agent);
      return agent.id;
    }
  }

  getAgents(sessionId) {
    return this.agents.filter(a => a.session_id === sessionId);
  }

  updateAgentStatus(sessionId, agentName, status) {
    const agent = this.agents.find(a => a.session_id === sessionId && a.name === agentName);
    if (agent) {
      agent.status = status;
    }
  }

  // Task methods
  upsertTask(sessionId, task) {
    const existing = this.tasks.find(t => t.session_id === sessionId && t.task_id === task.id);
    const now = new Date().toISOString();

    if (existing) {
      existing.subject = task.subject;
      existing.description = task.description;
      existing.status = task.status;
      existing.owner = task.owner || null;
      existing.updated_at = now;
      existing.completed_at = task.status === 'completed' ? now : null;
      return existing.id;
    } else {
      const newTask = {
        id: this.nextId.task++,
        session_id: sessionId,
        task_id: task.id,
        subject: task.subject,
        description: task.description,
        status: task.status,
        owner: task.owner || null,
        created_at: now,
        updated_at: now,
        completed_at: null
      };
      this.tasks.push(newTask);
      return newTask.id;
    }
  }

  getTasks(sessionId) {
    return this.tasks
      .filter(t => t.session_id === sessionId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  // Message methods
  saveMessage(sessionId, fromAgent, toAgent, content, messageType = 'message') {
    const message = {
      id: this.nextId.message++,
      session_id: sessionId,
      from_agent: fromAgent,
      to_agent: toAgent,
      content: content,
      message_type: messageType,
      timestamp: new Date().toISOString()
    };
    this.messages.push(message);
  }

  getMessages(sessionId, limit = 100) {
    return this.messages
      .filter(m => m.session_id === sessionId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Event methods
  logEvent(sessionId, eventType, eventData) {
    const event = {
      id: this.nextId.event++,
      session_id: sessionId,
      event_type: eventType,
      event_data: JSON.stringify(eventData),
      timestamp: new Date().toISOString()
    };
    this.events.push(event);
  }

  getEvents(sessionId, limit = 100) {
    return this.events
      .filter(e => e.session_id === sessionId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  close() {
    // No-op for in-memory version
  }
}

module.exports = SurveillanceDB;
