# Quick Start Guide

## 🚀 Start the Dashboard

```bash
cd ~/Documents/GitHub/agent-surveillance

# Option 1: Use the start script
./start.sh

# Option 2: Manual start
bun run dev
```

The dashboard will be available at **http://localhost:3847**

## ✅ Test It Out

### 1. Start the surveillance dashboard (in one Warp tab)
```bash
cd ~/Documents/GitHub/agent-surveillance
./start.sh
```

### 2. Create an agent team (in another Warp tab)
```bash
# Go to any project
cd ~/your-project

# Start Claude Code
claude

# Create a team (say the magic words!)
Create an agent team to build a simple contact form with a
frontend developer and backend developer.
```

### 3. Watch the magic happen ✨
Open http://localhost:3847 and watch your agent team in action:
- 🤖 See agents join the team
- 📋 Watch tasks move across the Kanban board
- 💬 Read messages between agents
- 📊 Monitor progress in real-time

## 📁 Project Location

```
~/Documents/GitHub/agent-surveillance/
```

## 🎯 Next Steps

1. **Use it across projects** - The dashboard monitors ALL agent teams from ALL projects
2. **Review history** - Click the "History" tab to see past sessions
3. **Customize** - Edit the code to add your own features
4. **Share it** - Push to GitHub and share with the community!

## 🛠️ Useful Commands

```bash
# Start dashboard
cd ~/Documents/GitHub/agent-surveillance && ./start.sh

# Stop dashboard
Press Ctrl+C

# View logs
# Logs appear in the terminal where you started the dashboard

# Check if it's running
curl http://localhost:3847/api/health
```

## 💡 Pro Tips

### Warp Workflow
- **Tab 1**: Surveillance dashboard
- **Tab 2**: Project A (with agent team)
- **Tab 3**: Project B (with another agent team)
- All teams visible in one dashboard!

### Best Practices
- Start the dashboard before creating agent teams
- Keep the dashboard running in the background
- Use the History tab to review completed sessions
- Monitor token usage to control costs

## 🐛 Troubleshooting

### Dashboard won't start
```bash
# Check if port is in use
lsof -i :3847

# Try a different port
PORT=8080 bun run dev
```

### No teams showing
1. Verify agent teams are enabled in `~/.claude/settings.json`
2. Restart Claude Code
3. Create a team with: "Create an agent team to..."

### Browser won't connect
- Make sure the server is running (check terminal output)
- Try http://localhost:3847 (not https)
- Check browser console for errors

## 📖 More Help

- Full docs: See `README.md`
- Installation: See `INSTALL.md`
- Issues: Check the troubleshooting section in README.md
