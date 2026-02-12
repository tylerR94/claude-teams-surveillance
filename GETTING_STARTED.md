# 🚀 Getting Started with Agent Surveillance

**👉 START HERE** - This is your complete setup guide for monitoring Claude Agent Teams.

> **💡 Tip:** You can feed this entire guide into Claude Code by saying:
>
> _"Read GETTING_STARTED.md and help me set up the agent surveillance dashboard"_

---

## 📋 Prerequisites

Before you begin, make sure you have:

### 1. Claude Code Installed

```bash
# Check if Claude Code is installed
claude --version

# If not installed, visit: https://code.claude.com
```

### 2. Node.js or Bun

**Option A: Bun (Recommended - Faster & Better)**
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

**Option B: Node.js LTS (v20+)**
```bash
# Install with nvm
nvm install 20
nvm use 20

# Verify installation
node --version  # Should be v20.x or higher
```

### 3. Enable Agent Teams in Claude Code

**⚠️ CRITICAL STEP** - Agent Teams must be enabled:

```bash
# Edit your Claude Code settings
nano ~/.claude/settings.json

# Add this configuration:
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

**After adding this, RESTART Claude Code completely** (exit and relaunch).

---

## 🖱️ IMPORTANT: Tmux Mouse Support Fix

### The Problem

If you use tmux, **you MUST enable mouse support** or you won't be able to click between panes!

Many users battle with this for hours before discovering the fix. Don't be that person! 🙃

### The Solution

**Add this to your `~/.tmux.conf` file:**

```bash
# Edit your tmux config
nano ~/.tmux.conf

# Add this line (or verify it exists):
# Enable mouse support (click panes, resize, scroll)
set -g mouse on

# Save and exit (Ctrl+X, then Y, then Enter)
```

**Then reload tmux:**

```bash
# If you're in a tmux session, reload the config:
tmux source-file ~/.tmux.conf

# Or just restart tmux:
tmux kill-server
tmux
```

### Verify Mouse Support

After reloading, you should be able to:
- ✅ Click to switch between tmux panes
- ✅ Click and drag to resize panes
- ✅ Scroll with your mouse wheel

**If clicking still doesn't work:**
1. Make sure you fully restarted tmux (`tmux kill-server`)
2. Check that `set -g mouse on` is actually in your `~/.tmux.conf`
3. Try creating a new tmux session: `tmux new -s test`

---

## 📦 Install the Dashboard

```bash
# Clone the repository (or navigate to it if you already have it)
cd ~/Documents/GitHub/agent-surveillance

# Install dependencies
bun install
# OR
npm install

# Verify installation worked
ls -la server/  # Should see index.js, watcher.js, etc.
```

### Troubleshooting Installation

**If `better-sqlite3` fails to compile:**
- Use Bun instead of npm (recommended)
- Or downgrade to Node v20: `nvm use 20`
- Or use lite mode: `npm install --omit=optional`

See [INSTALL.md](INSTALL.md) for detailed troubleshooting.

---

## 🎯 Choose Your Terminal Setup

Now that the basics are done, choose which terminal you'll use:

### Quick Decision Guide

**New to terminal multiplexing?**
→ Use **Warp** (easiest setup, modern UI)
→ Follow: [guides/WARP-GUIDE.md](guides/WARP-GUIDE.md)

**Already use tmux?**
→ Continue with **tmux** (powerful, session persistence)
→ Follow: [guides/TMUX-GUIDE.md](guides/TMUX-GUIDE.md)
→ **Remember:** You MUST have `set -g mouse on` in `~/.tmux.conf`!

**On macOS and want native features?**
→ Use **iTerm2** (native splits, hotkeys, automation)
→ Follow: [guides/ITERM2-GUIDE.md](guides/ITERM2-GUIDE.md)

**Not sure which to choose?**
→ Read: [guides/COMPARISON.md](guides/COMPARISON.md)

---

## 🔧 Quick Setup Script

Want to skip ahead? Run this to set up everything automatically:

```bash
#!/bin/bash
# Quick setup script for agent-surveillance

echo "🚀 Setting up Agent Surveillance Dashboard..."

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
    echo "❌ Claude Code not found. Install it first: https://code.claude.com"
    exit 1
fi

# Check if agent teams are enabled
if ! grep -q "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS" ~/.claude/settings.json 2>/dev/null; then
    echo "⚠️  Agent Teams not enabled. Enabling now..."
    mkdir -p ~/.claude
    echo '{"env":{"CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS":"1"}}' > ~/.claude/settings.json
    echo "✅ Agent Teams enabled. Please restart Claude Code!"
fi

# Check for tmux and enable mouse support
if command -v tmux &> /dev/null; then
    if ! grep -q "set -g mouse on" ~/.tmux.conf 2>/dev/null; then
        echo "⚠️  Tmux mouse support not enabled. Adding now..."
        echo "" >> ~/.tmux.conf
        echo "# Enable mouse support (click panes, resize, scroll)" >> ~/.tmux.conf
        echo "set -g mouse on" >> ~/.tmux.conf
        echo "✅ Mouse support added to ~/.tmux.conf"
        echo "   Run: tmux source-file ~/.tmux.conf"
    else
        echo "✅ Tmux mouse support already enabled"
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
if command -v bun &> /dev/null; then
    bun install
else
    npm install
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Choose your terminal setup:"
echo "   - Warp:   cat guides/WARP-GUIDE.md"
echo "   - tmux:   cat guides/TMUX-GUIDE.md"
echo "   - iTerm2: cat guides/ITERM2-GUIDE.md"
echo ""
echo "2. Start the dashboard:"
echo "   bun run dev"
echo ""
echo "3. Open in browser:"
echo "   http://localhost:3847"
```

Save this as `setup.sh`, make it executable (`chmod +x setup.sh`), and run it!

---

## ✅ Test Your Setup

Once you've completed the initial setup and chosen your terminal, test it out:

### 1. Start the Dashboard

```bash
cd ~/Documents/GitHub/agent-surveillance
bun run dev
# OR
npm run dev
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

### 2. Open the Dashboard

Open http://localhost:3847 in your browser. You should see:
- "Agent Surveillance Dashboard" title
- "No Active Teams" message (that's normal!)
- Real-time connection status

### 3. Create a Test Agent Team

In a **separate terminal tab/pane/window**, navigate to any project:

```bash
# Go to any project directory
cd ~/your-project

# Start Claude Code
claude

# Create a test team
Create a simple agent team with just one agent to test the surveillance dashboard.
```

### 4. Verify Dashboard Updates

Back in your browser, you should see:
- ✅ The new team appears
- ✅ Agent(s) listed with status
- ✅ Live activity feed shows events
- ✅ WebSocket status shows "Connected"

**If you see all of this: 🎉 SUCCESS! You're ready to go!**

---

## 🐛 Common Issues

### "No Active Teams" even after creating a team

1. Check agent teams are enabled: `cat ~/.claude/settings.json`
2. Restart Claude Code completely
3. Check `~/.claude/teams/` exists: `ls -la ~/.claude/teams/`
4. Check dashboard logs for errors

### Can't click between tmux panes

**This is the most common issue!**

1. Make sure `set -g mouse on` is in `~/.tmux.conf`
2. Reload tmux: `tmux source-file ~/.tmux.conf`
3. Or restart tmux: `tmux kill-server && tmux`

### Dashboard won't start (port in use)

```bash
# Check what's using port 3847
lsof -i :3847

# Kill it or use a different port
PORT=8080 bun run dev
```

### WebSocket keeps disconnecting

1. Ensure server is running on port 3847
2. Check browser console for errors (F12)
3. Try a different browser
4. Check firewall settings

---

## 📖 Next Steps

After completing this guide:

1. **Choose your terminal guide** from the decision tree above
2. **Read the terminal-specific guide** for advanced workflows
3. **Start using agent teams** for real projects!
4. **Check out [KNOWN_ISSUES.md](KNOWN_ISSUES.md)** for common Claude Code bugs

---

## 🆘 Need More Help?

- **Installation issues:** See [INSTALL.md](INSTALL.md)
- **Quick reference:** See [QUICKSTART.md](QUICKSTART.md)
- **Full documentation:** See [README.md](README.md)
- **Terminal comparison:** See [guides/COMPARISON.md](guides/COMPARISON.md)
- **Known Claude Code bugs:** See [KNOWN_ISSUES.md](KNOWN_ISSUES.md)

---

## 🎓 Understanding the Architecture

Before diving into your terminal-specific guide, it helps to understand how this all works:

```
Your Project              Claude Code creates          Surveillance Dashboard
    (anywhere)     →     ~/.claude/teams/    ←    monitors and displays
                              └── team-name/
                                  ├── config.json
                                  ├── inboxes/
                                  └── tasks/
```

The surveillance dashboard watches `~/.claude/` for changes and displays them in real-time.

**Key points:**
- ✅ Dashboard monitors ALL projects at once
- ✅ Works with ANY terminal setup
- ✅ Persists history to SQLite database
- ✅ Updates in real-time via WebSocket

---

**Ready to continue? Pick your terminal from the decision guide above and dive into the specific guide!** 🚀

---

_Last Updated: February 2026_
_For issues or questions, see [KNOWN_ISSUES.md](KNOWN_ISSUES.md)_
