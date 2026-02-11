const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class SurveillanceDB {
  constructor() {
    const dbDir = path.join(__dirname, '..', 'database');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.db = new Database(path.join(dbDir, 'surveillance.db'));
    this.initSchema();
  }

  initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_name TEXT NOT NULL,
        started_at TEXT NOT NULL,
        ended_at TEXT,
        status TEXT DEFAULT 'active',
        total_tokens INTEGER DEFAULT 0,
        config TEXT
      );

      CREATE TABLE IF NOT EXISTS agents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        agent_type TEXT,
        model TEXT,
        status TEXT DEFAULT 'active',
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        task_id TEXT,
        subject TEXT,
        description TEXT,
        status TEXT,
        owner TEXT,
        created_at TEXT,
        updated_at TEXT,
        completed_at TEXT,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      );

      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        from_agent TEXT,
        to_agent TEXT,
        content TEXT,
        message_type TEXT,
        timestamp TEXT,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      );

      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        event_type TEXT,
        event_data TEXT,
        timestamp TEXT,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      );

      CREATE INDEX IF NOT EXISTS idx_sessions_team ON sessions(team_name);
      CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_session ON tasks(session_id);
      CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);
    `);

    console.log('✅ Database schema initialized');
  }

  // Session methods
  createSession(teamName, config) {
    const stmt = this.db.prepare(`
      INSERT INTO sessions (team_name, started_at, config, status)
      VALUES (?, ?, ?, 'active')
    `);

    const result = stmt.run(
      teamName,
      new Date().toISOString(),
      JSON.stringify(config)
    );

    return result.lastInsertRowid;
  }

  getActiveSession(teamName) {
    const stmt = this.db.prepare(`
      SELECT * FROM sessions
      WHERE team_name = ? AND status = 'active'
      ORDER BY started_at DESC
      LIMIT 1
    `);

    return stmt.get(teamName);
  }

  endSession(sessionId, totalTokens = 0) {
    const stmt = this.db.prepare(`
      UPDATE sessions
      SET ended_at = ?, status = 'completed', total_tokens = ?
      WHERE id = ?
    `);

    stmt.run(new Date().toISOString(), totalTokens, sessionId);
  }

  getAllSessions(limit = 50) {
    const stmt = this.db.prepare(`
      SELECT * FROM sessions
      ORDER BY started_at DESC
      LIMIT ?
    `);

    return stmt.all(limit);
  }

  // Agent methods
  upsertAgent(sessionId, agentName, agentType, model) {
    const existing = this.db.prepare(`
      SELECT id FROM agents WHERE session_id = ? AND name = ?
    `).get(sessionId, agentName);

    if (existing) {
      const stmt = this.db.prepare(`
        UPDATE agents
        SET agent_type = ?, model = ?, status = 'active'
        WHERE id = ?
      `);
      stmt.run(agentType, model, existing.id);
      return existing.id;
    } else {
      const stmt = this.db.prepare(`
        INSERT INTO agents (session_id, name, agent_type, model, status)
        VALUES (?, ?, ?, ?, 'active')
      `);
      const result = stmt.run(sessionId, agentName, agentType, model);
      return result.lastInsertRowid;
    }
  }

  getAgents(sessionId) {
    const stmt = this.db.prepare(`
      SELECT * FROM agents WHERE session_id = ?
    `);
    return stmt.all(sessionId);
  }

  updateAgentStatus(sessionId, agentName, status) {
    const stmt = this.db.prepare(`
      UPDATE agents
      SET status = ?
      WHERE session_id = ? AND name = ?
    `);
    stmt.run(status, sessionId, agentName);
  }

  // Task methods
  upsertTask(sessionId, task) {
    const existing = this.db.prepare(`
      SELECT id FROM tasks WHERE session_id = ? AND task_id = ?
    `).get(sessionId, task.id);

    const now = new Date().toISOString();

    if (existing) {
      const stmt = this.db.prepare(`
        UPDATE tasks
        SET subject = ?, description = ?, status = ?, owner = ?,
            updated_at = ?, completed_at = ?
        WHERE id = ?
      `);
      stmt.run(
        task.subject,
        task.description,
        task.status,
        task.owner || null,
        now,
        task.status === 'completed' ? now : null,
        existing.id
      );
      return existing.id;
    } else {
      const stmt = this.db.prepare(`
        INSERT INTO tasks (session_id, task_id, subject, description, status, owner, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        sessionId,
        task.id,
        task.subject,
        task.description,
        task.status,
        task.owner || null,
        now,
        now
      );
      return result.lastInsertRowid;
    }
  }

  getTasks(sessionId) {
    const stmt = this.db.prepare(`
      SELECT * FROM tasks WHERE session_id = ? ORDER BY created_at ASC
    `);
    return stmt.all(sessionId);
  }

  // Message methods
  saveMessage(sessionId, fromAgent, toAgent, content, messageType = 'message') {
    const stmt = this.db.prepare(`
      INSERT INTO messages (session_id, from_agent, to_agent, content, message_type, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      sessionId,
      fromAgent,
      toAgent,
      content,
      messageType,
      new Date().toISOString()
    );
  }

  getMessages(sessionId, limit = 100) {
    const stmt = this.db.prepare(`
      SELECT * FROM messages
      WHERE session_id = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `);
    return stmt.all(sessionId, limit);
  }

  // Event methods
  logEvent(sessionId, eventType, eventData) {
    const stmt = this.db.prepare(`
      INSERT INTO events (session_id, event_type, event_data, timestamp)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(
      sessionId,
      eventType,
      JSON.stringify(eventData),
      new Date().toISOString()
    );
  }

  getEvents(sessionId, limit = 100) {
    const stmt = this.db.prepare(`
      SELECT * FROM events
      WHERE session_id = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `);
    return stmt.all(sessionId, limit);
  }

  close() {
    this.db.close();
  }
}

module.exports = SurveillanceDB;
