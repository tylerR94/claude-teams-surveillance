# 🌊 Using Claude Agent Teams with Warp Terminal

The ultimate guide to running agent teams in Warp with the surveillance dashboard.

## Why Warp?

Warp is a modern, AI-powered terminal that's perfect for agent teams:
- ✅ Clean, intuitive UI
- ✅ Built-in AI assistant
- ✅ Easy tab/split management
- ✅ Command search and history
- ✅ Blocks for better command organization

## 🎯 Recommended Warp Workflow

### The 3-Tab Setup (Best for Most Users)

```
┌─────────────────────────────────────────────────────┐
│ Warp Window                                          │
├─────────────────────────────────────────────────────┤
│ Tab 1: 📊 Surveillance Dashboard (always running)   │
│ Tab 2: 💻 Main Project (agent teams)                │
│ Tab 3: 📝 Notes/Testing (optional)                  │
└─────────────────────────────────────────────────────┘
```

#### Tab 1: Surveillance Dashboard
```bash
cd ~/Documents/GitHub/agent-surveillance
./start.sh

# Leave this running - it monitors ALL your teams
```

#### Tab 2: Your Project Work
```bash
cd ~/your-project
claude

# Create teams as needed
"Create an agent team to build the email campaign API"
```

#### Tab 3: Monitoring/Testing (Optional)
```bash
# Monitor Claude directories
watch -n 2 'ls -la ~/.claude/teams/'

# Or test API endpoints
curl http://localhost:3847/api/teams

# Or check logs
tail -f ~/.claude/debug/*.log
```

## 🚀 Quick Start Guide

### Step 1: Enable Agent Teams

Add to `~/.claude/settings.json`:
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

**Restart Claude Code after adding this!**

### Step 2: Start Surveillance Dashboard

**New Warp tab** (⌘T):
```bash
cd ~/Documents/GitHub/agent-surveillance
./start.sh
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║   🔍 Claude Agent Team Surveillance Dashboard             ║
╠═══════════════════════════════════════════════════════════╣
║   Server:     http://localhost:3847                       ║
║   WebSocket:  ws://localhost:3847                         ║
║   Status:     🟢 Running                                   ║
╚═══════════════════════════════════════════════════════════╝
```

**Open the dashboard**: http://localhost:3847

### Step 3: Create Your First Team

**New Warp tab** (⌘T):
```bash
cd ~/your-project
claude
```

**In Claude Code**, say the magic words:
```
Create an agent team to build a simple contact form with
a frontend developer and backend developer.
```

### Step 4: Watch the Magic

Switch to your browser at http://localhost:3847 and watch:
- 🤖 Agents joining the team
- 📋 Tasks being created and completed
- 💬 Messages between agents
- 📊 Real-time progress updates

## 🎨 Warp-Specific Features

### 1. Command Palette (⌘K)
Quick access to common commands:
```bash
# Add these as Warp workflows
start-surveillance    → cd ~/Documents/GitHub/agent-surveillance && ./start.sh
check-teams          → ls -la ~/.claude/teams/
view-dashboard       → open http://localhost:3847
```

### 2. Warp Blocks
Each command gets its own block - perfect for organizing:
```bash
# Block 1: Start dashboard
cd ~/Documents/GitHub/agent-surveillance && ./start.sh

# Block 2: Check status
curl http://localhost:3847/api/health

# Block 3: View teams
curl http://localhost:3847/api/teams | jq .
```

### 3. Warp AI
Use Warp's AI to help with commands:
```
# Ask Warp AI:
"Show me all running agent teams"
"Check if surveillance dashboard is running"
"Kill process on port 3847"
```

### 4. Split Panes
Warp supports splits within tabs:
```
⌘D    - Split vertically
⌘⇧D   - Split horizontally
```

**Example Split Layout:**
```
┌─────────────────────────────────┬─────────────────────┐
│ Left: Claude Code session       │ Right: Log watcher  │
│ (agent team running)            │ tail -f server.log  │
└─────────────────────────────────┴─────────────────────┘
```

## 💡 Pro Tips for Warp

### 1. Keep Dashboard Running
The dashboard should be your "always on" tab. Pin it:
- Right-click the tab → "Pin Tab"
- It stays even if you close other tabs

### 2. Use Warp's Session Restoration
Warp remembers your tabs and commands. Set up once, reuse forever:
1. Arrange your 3-tab setup
2. Warp auto-saves your session
3. Next time, reopen and run `./start.sh`

### 3. Background the Dashboard
If you don't want a dedicated tab:
```bash
cd ~/Documents/GitHub/agent-surveillance
./start.sh &
disown

# Dashboard runs in background
# View output: tail -f /tmp/surveillance.log
```

### 4. Custom Shortcuts
Add to your shell config (`~/.zshrc` or `~/.bashrc`):
```bash
# Quick aliases
alias surveillance='cd ~/Documents/GitHub/agent-surveillance && ./start.sh'
alias check-teams='curl -s http://localhost:3847/api/teams | jq .'
alias dashboard='open http://localhost:3847'

# Quick navigation
alias goto-surveillance='cd ~/Documents/GitHub/agent-surveillance'
```

### 5. Warp Workflows
Create custom workflows in Warp:

**Workflow: start-agent-team**
```yaml
name: Start Agent Team
description: Start surveillance dashboard and create a team
commands:
  - cd ~/Documents/GitHub/agent-surveillance && ./start.sh &
  - sleep 2
  - open http://localhost:3847
  - echo "Dashboard ready! Create a team in Claude Code"
```

## 🎯 Common Workflows

### Workflow 1: Daily Development
```bash
# Morning routine

# Tab 1: Start dashboard
cd ~/Documents/GitHub/agent-surveillance && ./start.sh

# Tab 2: Project work
cd ~/your-project && claude

# Tab 3: Testing/monitoring
watch -n 5 'curl -s http://localhost:3847/api/teams | jq .'
```

### Workflow 2: Multi-Project Day
```bash
# Tab 1: Dashboard (always on)
cd ~/Documents/GitHub/agent-surveillance && ./start.sh

# Tab 2: Project A
cd ~/project-a && claude
"Create an agent team to refactor authentication"

# Tab 3: Project B
cd ~/project-b && claude
"Create an agent team to fix the payment flow"

# Tab 4: Project C
cd ~/project-c && claude
"Create an agent team to add dark mode"

# All visible in one dashboard!
```

### Workflow 3: Debug Session
```bash
# Tab 1: Dashboard
cd ~/Documents/GitHub/agent-surveillance && ./start.sh

# Tab 2: Debug team
cd ~/broken-project && claude
"Create an agent team to debug why the API returns 500 errors"

# Tab 3: Watch the investigation
# Split pane:
# Left: tail -f ~/.claude/debug/*.log
# Right: curl http://localhost:3847/api/teams/debug-team
```

## 🔧 Troubleshooting in Warp

### Dashboard Not Starting
```bash
# Check if port is busy
lsof -i :3847

# Kill the process
kill -9 $(lsof -t -i :3847)

# Try again
./start.sh
```

### Agent Teams Not Showing
```bash
# 1. Verify feature flag
cat ~/.claude/settings.json | jq .env

# 2. Check team directories
ls -la ~/.claude/teams/

# 3. Restart Claude Code
# Exit and reopen Claude Code
```

### WebSocket Connection Issues
```bash
# Check if server is running
curl http://localhost:3847/api/health

# Check browser console (F12)
# Should see: "🔌 Connecting to WebSocket..."
```

## 🎨 Warp Themes for Agent Teams

Make your surveillance tab stand out:

**Settings → Appearance → Tab Theme**
- Dashboard tab: Purple or Orange (matches Claude colors)
- Project tabs: Default or Blue

## 📊 Advanced: Warp + Tmux Hybrid

Want both Warp's UI AND tmux's power?

```bash
# In Warp, start tmux
tmux

# Now create teams - they'll use tmux split panes
claude
"Create an agent team to..."

# Benefits:
# - Warp's modern UI
# - Tmux's split pane management
# - Surveillance dashboard in separate Warp tab
```

## 🎁 Bonus: Warp AI Integration

Use Warp's AI to help with agent teams:

**Ask Warp AI:**
- "How do I check if my agent team is still running?"
- "Show me the last 10 messages from my agent team"
- "What's the best way to monitor Claude agent teams?"

**Warp AI will suggest:**
```bash
# Check teams
curl http://localhost:3847/api/teams | jq '.teams[].name'

# View messages
curl http://localhost:3847/api/teams/your-team | jq '.messages'
```

## 📖 Quick Reference

### Essential Commands
```bash
# Start dashboard
cd ~/Documents/GitHub/agent-surveillance && ./start.sh

# Check health
curl http://localhost:3847/api/health

# List teams
curl http://localhost:3847/api/teams | jq .

# View specific team
curl http://localhost:3847/api/teams/team-name | jq .

# Open dashboard
open http://localhost:3847
```

### Warp Keyboard Shortcuts
```
⌘T          - New tab
⌘W          - Close tab
⌘{          - Previous tab
⌘}          - Next tab
⌘D          - Split vertically
⌘⇧D         - Split horizontally
⌘K          - Command palette
⌘R          - Search commands
⌘⇧C         - Copy block
```

## 🚀 Next Steps

1. **Set up your 3-tab workflow** (Dashboard, Project, Optional)
2. **Create custom aliases** for quick access
3. **Pin your dashboard tab** so it's always there
4. **Experiment with splits** for multi-view monitoring

## 💬 Community Tips

Share your Warp + Agent Teams workflow:
- What tab layout works best for you?
- Any custom Warp workflows you've created?
- How do you organize multi-project monitoring?

---

**Happy coding with Warp and Claude Agent Teams!** 🌊🤖

**Questions?** Check the main [README.md](../README.md) or [QUICKSTART.md](../QUICKSTART.md)
