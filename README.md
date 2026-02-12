# 🔍 Claude Teams & Surveillance Dashboard

[![GitHub stars](https://img.shields.io/github/stars/tylerR94/claude-teams-surveillance?style=social)](https://github.com/tylerR94/claude-teams-surveillance)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Real-time monitoring dashboard for [Claude Code Agent Teams](https://code.claude.com/docs/en/agent-teams). Track multiple agent teams across all your projects with live updates, task tracking, and message history.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Dashboard+Preview)

## ✨ Features

- 🔴 **Real-time monitoring** - WebSocket-based live updates
- 🤖 **Multi-team support** - Monitor multiple agent teams simultaneously
- 📊 **Kanban task board** - Visual task tracking (pending, in progress, completed)
- 💬 **Message threading** - See inter-agent communication
- 📈 **Session history** - Review past team sessions
- 🎨 **Beautiful UI** - Dark mode, responsive design
- 💾 **SQLite database** - Persistent storage for history and analytics

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│  Your Projects (anywhere on your system)            │
│  ~/project-A/ → Creates team "web-app-build"       │
│  ~/project-B/ → Creates team "refactor-auth"       │
└─────────────────────────────────────────────────────┘
                       ↓
              All write to same location
                       ↓
┌─────────────────────────────────────────────────────┐
│  ~/.claude/teams/     (Global Claude directory)     │
│  └── {team-name}/                                   │
│      ├── config.json      ← Team configuration     │
│      └── inboxes/         ← Agent messages         │
│                                                      │
│  ~/.claude/tasks/                                   │
│  └── {team-name}/         ← Shared task lists      │
└─────────────────────────────────────────────────────┘
                       ↑
              File System Watcher (chokidar)
                       ↓
┌─────────────────────────────────────────────────────┐
│  Surveillance Dashboard (this project)               │
│  • Backend: Node.js + Express + WebSocket           │
│  • Frontend: Next.js + React + Tailwind             │
│  • Database: SQLite                                  │
│  • Port: localhost:3847                             │
└─────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

> **👉 NEW USERS: START HERE!**
>
> **[📖 Read the Complete Getting Started Guide](GETTING_STARTED.md)**
>
> This guide covers everything: prerequisites, the critical tmux mouse support fix, installation, and choosing your terminal setup.

### Prerequisites

- Node.js 18+ or Bun
- Claude Code with agent teams enabled ([docs](https://code.claude.com/docs/en/agent-teams))

### Installation

```bash
# Clone or navigate to the project
cd ~/Documents/GitHub/agent-surveillance

# Install dependencies
npm install
# or
bun install

# Start the dashboard
npm run dev
# or
bun run dev
```

The dashboard will be available at **http://localhost:3847**

**Note:** The backend API runs on port 3847, and the Next.js frontend runs on port 3848 (to avoid conflicts with apps in the 3000-3100 range).

### Enable Agent Teams in Claude Code

If you haven't already, enable agent teams:

```json
// ~/.claude/settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Restart Claude Code after adding this setting.

## 📖 Usage

### 1. Start the Dashboard

```bash
cd ~/Documents/GitHub/agent-surveillance
npm run dev
```

Open http://localhost:3847 in your browser.

### 2. Create an Agent Team in Claude Code

In any project, tell Claude Code to create an agent team:

```
Create an agent team to build a user authentication system with a
frontend developer, backend developer, and database architect.
```

### 3. Monitor in Real-Time

The dashboard automatically detects new teams and updates in real-time:
- ✅ Team members and their status
- ✅ Task progress (Kanban board)
- ✅ Inter-agent messages
- ✅ Live activity feed

### 4. Review History

Click the "History" tab to review completed sessions with full details.

## 🎯 Warp Integration

Using Warp terminal? Here's the recommended setup:

### Option 1: Separate Tabs (Recommended)

```bash
# Warp Tab 1: Start surveillance dashboard
cd ~/Documents/GitHub/agent-surveillance
npm run dev

# Warp Tab 2: Your project work
cd ~/your-project
claude
"Create an agent team to..."

# Warp Tab 3: Another project (optional)
cd ~/another-project
claude
"Create an agent team to..."
```

The dashboard monitors ALL teams across ALL tabs!

### Option 2: Background Process

```bash
# Start dashboard in background
cd ~/Documents/GitHub/agent-surveillance
npm start &

# Continue working in your project
cd ~/your-project
claude
```

## 🛠️ Development

### Project Structure

```
agent-surveillance/
├── server/
│   ├── index.js          # Express + WebSocket server
│   ├── watcher.js        # File system watcher
│   └── database.js       # SQLite database layer
├── src/
│   ├── app/
│   │   ├── page.tsx      # Main dashboard page
│   │   └── layout.tsx    # App layout
│   ├── components/
│   │   ├── TeamSelector.tsx
│   │   ├── AgentList.tsx
│   │   ├── KanbanBoard.tsx
│   │   └── LiveActivity.tsx
│   └── lib/
│       └── websocket-client.ts
├── database/
│   └── surveillance.db   # SQLite database (auto-created)
└── package.json
```

### Scripts

```bash
# Development (backend + frontend)
npm run dev

# Backend only
npm run server

# Frontend only
npm run frontend

# Production build
npm run build
npm start
```

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/teams` - List active teams
- `GET /api/teams/:teamName` - Get team details
- `GET /api/history` - Get session history
- `POST /api/teams/:teamName/end` - End a session

### WebSocket Events

**Server → Client:**
- `initial:state` - Current state on connection
- `team:update` - Team configuration changed
- `task:update` - Task status changed
- `message:new` - New inter-agent message
- `session:ended` - Team session completed

## 🎨 Customization

### Change Port

```bash
PORT=8080 npm run dev
```

Or edit `server/index.js`:

```javascript
const PORT = process.env.PORT || 3847;
```

### Styling

The project uses Tailwind CSS. Customize colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'claude-orange': '#FF6B35',
      'claude-purple': '#7B2CBF',
    },
  },
}
```

## 📊 Database Schema

SQLite database with the following tables:

- **sessions** - Team sessions (id, team_name, started_at, ended_at, status, total_tokens)
- **agents** - Team members (id, session_id, name, agent_type, model, status)
- **tasks** - Tasks (id, session_id, task_id, subject, description, status, owner)
- **messages** - Inter-agent messages (id, session_id, from_agent, to_agent, content)
- **events** - System events (id, session_id, event_type, event_data, timestamp)

## 🐛 Troubleshooting

### Dashboard shows "No Active Teams"

1. Verify agent teams are enabled in `~/.claude/settings.json`
2. Restart Claude Code after enabling
3. Create a team with: `"Create an agent team to..."`
4. Check `~/.claude/teams/` directory exists

### WebSocket disconnected

1. Ensure the server is running on port 3847
2. Check for port conflicts: `lsof -i :3847`
3. Check browser console for errors

### Tasks not updating

1. Verify file watcher is running (check server console)
2. Check file permissions on `~/.claude/` directory
3. Restart the surveillance server

### Agent Teams inbox polling issues

If teammates send messages but the team lead never receives them, see the **[Known Issues](KNOWN_ISSUES.md)** document for a detailed fix for the inbox polling bug.

## 🤝 Contributing

Contributions welcome! This is designed to be a community tool.

## 📄 License

MIT License - feel free to use, modify, and distribute.

## 🔗 Resources

- [Claude Code Documentation](https://code.claude.com/docs)
- [Agent Teams Guide](https://code.claude.com/docs/en/agent-teams)
- [Claude Code on GitHub](https://github.com/anthropics/claude-code)

## 🙏 Acknowledgments

Inspired by the agent teams feature in Claude Code Opus 4.6 and the need for better visibility into multi-agent workflows.

---

**Built with ❤️ for the Claude Code community**
