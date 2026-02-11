# 🖥️ Using Claude Agent Teams with iTerm2

Complete guide to running agent teams with iTerm2's native split panes and the surveillance dashboard.

## Why iTerm2?

iTerm2 is the gold standard macOS terminal:
- ✅ Native macOS split panes (no tmux needed)
- ✅ Beautiful, customizable UI
- ✅ Excellent performance
- ✅ Hotkey window support
- ✅ Native agent team integration

## 🚀 Quick Start

### 1. Install iTerm2

```bash
# Via Homebrew
brew install --cask iterm2

# Or download from:
# https://iterm2.com/

# Verify Python API support
which it2
```

### 2. Install it2 CLI (Required)

```bash
# Install it2 CLI tool
npm install -g it2
# or
brew install it2
```

### 3. Enable Python API in iTerm2

**iTerm2 → Settings → General → Magic**
- ✅ Enable Python API

Restart iTerm2 after enabling!

### 4. Configure Claude Code

`~/.claude/settings.json`:
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "teammateMode": "tmux"
}
```

**Note:** Use "tmux" mode even for iTerm2 - it will detect iTerm2 automatically and use native splits!

**Restart Claude Code!**

## 🎯 Recommended iTerm2 Layout

### Option 1: Tabbed Layout (Recommended for Beginners)

```
┌─────────────────────────────────────────────────────────┐
│ iTerm2                              ✕ ➖ 🟢 🟡 🔴      │
├─────────────────────────────────────────────────────────┤
│ Dashboard | Project | Team Monitor | Logs               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🔍 Claude Agent Surveillance Dashboard                 │
│  Server: http://localhost:3847                          │
│  Status: 🟢 Running                                      │
│                                                          │
│  Watching 2 teams:                                      │
│  • web-app-build (3 agents)                            │
│  • api-refactor (2 agents)                             │
│                                                          │
└─────────────────────────────────────────────────────────┘

Switch tabs: ⌘1, ⌘2, ⌘3, ⌘4
```

### Option 2: Split Pane Layout (Advanced)

```
┌──────────────────────────────┬─────────────────────────┐
│ Dashboard Server             │ Claude Code (Team Lead) │
│                              │                         │
│ 🔍 Running on :3847          │ $ claude                │
│                              │                         │
│ 📊 2 active teams            │ Create an agent team    │
│ 💬 24 messages received      │ to build...             │
│                              │                         │
├──────────────────────────────┴─────────────────────────┤
│ Browser: http://localhost:3847                         │
│                                                         │
│ [Team: web-app-build]                                  │
│ ┌─────────┬──────────┬──────────┐                    │
│ │ Pending │ Progress │ Complete │                     │
│ │  Task 3 │  Task 1  │  Task 2  │                     │
│ └─────────┴──────────┴──────────┘                    │
└─────────────────────────────────────────────────────────┘

Split: ⌘D (horizontal) or ⌘⇧D (vertical)
```

### Option 3: Automatic Agent Panes

When you create a team with iTerm2 integration enabled:

```
┌─────────────┬─────────────┬─────────────┐
│ Team Lead   │ Frontend    │ Backend     │
│             │ Developer   │ Developer   │
│             │             │             │
│ Coordinating│ Building UI │ Building API│
│   tasks     │             │             │
│             │             │             │
├─────────────┴─────────────┴─────────────┤
│ Database Architect                       │
│                                          │
│ Setting up schema                        │
└──────────────────────────────────────────┘

Each pane = separate Claude Code instance!
Auto-created by agent teams
```

## 📋 iTerm2 Basics

### Essential Keyboard Shortcuts

```bash
# Tabs
⌘T         # New tab
⌘W         # Close tab
⌘1-9       # Switch to tab 1-9
⌘←/→       # Previous/next tab

# Panes (splits)
⌘D         # Split vertically (side by side)
⌘⇧D        # Split horizontally (top/bottom)
⌘[/]       # Switch between panes
⌘⌥→/←/↑/↓  # Navigate panes with arrows
⌘⇧⏎        # Maximize current pane

# Windows
⌘⌥Number   # Switch between iTerm2 windows

# Other
⌘F         # Find in output
⌘K         # Clear buffer
⌘;         # Autocomplete
⌘/         # Show cursor location
```

### iTerm2-Specific Features

**1. Hotkey Window**
Press a global hotkey to show/hide iTerm2
- Settings → Keys → Hotkey → Create dedicated hotkey window
- Suggested: `⌘\`` (Command + Backtick)

**2. Profile Switching**
Different profiles for different tasks
- Dashboard profile: Dark background, larger font
- Project profile: Light background, code font
- Logs profile: Small font, high scrollback

**3. Triggers**
Auto-highlight important messages:
- Settings → Profiles → Advanced → Triggers
- Match: "Team update|Task completed|Error"
- Action: Highlight text

## 🎨 Recommended Workflows

### Workflow 1: Tabbed Development

**Setup:**
```bash
# Tab 1: Dashboard (⌘1)
cd ~/Documents/GitHub/agent-surveillance
./start.sh

# Tab 2: Project (⌘T, then ⌘2)
cd ~/your-project
claude

# Tab 3: Monitoring (⌘T, then ⌘3)
watch -n 2 'curl -s http://localhost:3847/api/teams | jq .'

# Tab 4: Logs (⌘T, then ⌘4)
tail -f ~/.claude/debug/*.log
```

**Usage:**
- `⌘1` - Check dashboard status
- `⌘2` - Work with Claude
- `⌘3` - Monitor teams
- `⌘4` - Debug issues

### Workflow 2: Split Pane Mastery

**Setup:**
```bash
# Start in full window
cd ~/Documents/GitHub/agent-surveillance
./start.sh

# Split vertically (⌘D)
# Right pane: project work
cd ~/your-project
claude

# Split right pane horizontally (⌘⇧D)
# Bottom right: log viewer
tail -f server.log

# Split left pane horizontally (⌘[, then ⌘⇧D)
# Bottom left: API monitor
watch -n 2 'curl -s http://localhost:3847/api/teams | jq .'
```

**Result:**
```
┌──────────────────┬──────────────────┐
│ Dashboard        │ Claude Code      │
│ ./start.sh       │ (Team Lead)      │
├──────────────────┼──────────────────┤
│ API Monitor      │ Logs             │
│ watch curl...    │ tail -f logs     │
└──────────────────┴──────────────────┘
```

### Workflow 3: Multiple Windows

Perfect for multi-monitor setups:

**Window 1 (Monitor 1): Dashboard + Browser**
```bash
# iTerm2 window on left side
cd ~/Documents/GitHub/agent-surveillance && ./start.sh

# Browser on right side
open http://localhost:3847
```

**Window 2 (Monitor 2): Development**
```bash
# New iTerm2 window (⌘N)
# Split for multiple projects

# Left: Project A
cd ~/project-a && claude

# Right (⌘D): Project B
cd ~/project-b && claude
```

**Window 3 (Monitor 1 or 2): System Monitoring**
```bash
# New iTerm2 window (⌘N)
# Split into 4 panes for monitoring

# Pane 1: htop
htop

# Pane 2: Team status
watch -n 2 'curl -s http://localhost:3847/api/teams | jq ".teams[].name"'

# Pane 3: File watcher
watch -n 1 'ls -lt ~/.claude/teams/'

# Pane 4: Network activity
sudo tcpdump -i lo0 port 3847
```

## 🎨 iTerm2 Customization for Agent Teams

### 1. Create Custom Profiles

**Settings → Profiles → + (Add New Profile)**

**Profile: "Agent Dashboard"**
```
Name: Agent Dashboard
Colors: Dark background (purple/orange accent)
Font: Monaco 14pt
Scrollback: 10000 lines
Initial command: cd ~/Documents/GitHub/agent-surveillance && ./start.sh
```

**Profile: "Agent Development"**
```
Name: Agent Development
Colors: Light background
Font: JetBrains Mono 13pt
Initial command: cd ~/your-project && claude
```

**Profile: "Agent Monitor"**
```
Name: Agent Monitor
Colors: Dark green background
Font: Monaco 11pt (smaller for logs)
Scrollback: 50000 lines
Initial command: watch -n 2 'curl -s http://localhost:3847/api/teams | jq .'
```

### 2. Custom Color Schemes

**Settings → Profiles → Colors**

**For Dashboard Profile:**
```
Foreground: #E0E0E0
Background: #1A1A2E
Selection: #7B2CBF (Claude purple)
Bold: #FF6B35 (Claude orange)
```

**For Development Profile:**
```
Use "Solarized Light" or "GitHub Light"
```

### 3. Badges

Show status in window corner:
**Settings → Profiles → General → Badge**

```
Dashboard: 🔍 \(session.name)
Project: 🤖 \(session.name)
Monitor: 📊 \(session.name)
```

### 4. Triggers (Auto-Highlighting)

**Settings → Profiles → Advanced → Triggers**

```
Regex: (Team update|Task completed)
Action: Highlight Text
Color: Green

Regex: (Error|Failed|Exception)
Action: Highlight Text
Color: Red

Regex: (Message|💬)
Action: Highlight Text
Color: Blue
```

## 🚀 Agent Teams Auto-Split with iTerm2

When `it2` CLI is properly set up, Claude Code can create split panes automatically!

### How It Works

**1. Ensure it2 is installed:**
```bash
which it2
# Should output: /usr/local/bin/it2 or similar
```

**2. Start Claude Code in iTerm2:**
```bash
claude
```

**3. Create a team:**
```
Create an agent team with 3 developers to build a dashboard
```

**4. Watch iTerm2 auto-split:**

```
┌─────────────────┬─────────────────┐
│ Team Lead       │ Developer 1     │
│ (main window)   │ (new split)     │
│                 │                 │
│ Coordinating... │ Building UI...  │
├─────────────────┼─────────────────┤
│ Developer 2     │ Developer 3     │
│ (new split)     │ (new split)     │
│                 │                 │
│ Building API... │ Writing tests...│
└─────────────────┴─────────────────┘
```

Each split is a separate Claude Code instance!

### Troubleshooting Auto-Split

**Splits not appearing?**
```bash
# 1. Verify Python API
# iTerm2 → Settings → General → Magic
# ✅ Enable Python API must be checked

# 2. Test it2 CLI
it2 create-tab

# 3. Check Claude settings
cat ~/.claude/settings.json | jq .teammateMode

# 4. Restart iTerm2
```

## 💡 Pro Tips

### 1. Arrangements (Save Layouts)

**Window → Save Window Arrangement**
Name it: "Agent Team Development"

**Result:**
- Saves all tabs, splits, profiles
- Restore anytime: Window → Restore Window Arrangement

**My recommended arrangement:**
```
Name: Agent Development Full Stack
Tabs:
  1. Dashboard (profile: Agent Dashboard)
  2. Frontend Team (split: lead + 2 developers)
  3. Backend Team (split: lead + 2 developers)
  4. Monitoring (split: 4 monitors)
```

### 2. Hotkey Window for Dashboard

**Settings → Keys → Hotkey**
- Create a dedicated hotkey window
- Profile: Agent Dashboard
- Hotkey: `⌘`` (Command + Backtick)

**Result:**
- Press `⌘\`` anywhere → Dashboard appears
- Press again → Dashboard hides
- Always accessible!

### 3. Instant Replay

Record terminal output:
**View → Start Instant Replay** (⌘⌥B)

**Use case:**
- Agent sent a message you missed
- Review task update that scrolled by
- Debug what command an agent ran

### 4. Timestamps

Show when each command ran:
**Settings → Profiles → Session**
- ✅ Show timestamps

Perfect for tracking agent activity timeline!

### 5. Status Bar

**Settings → Profiles → Session → Configure Status Bar**

Add components:
- CPU utilization
- Memory usage
- Current directory
- Git branch
- Custom: `curl -s http://localhost:3847/api/teams | jq '.teams | length'`

Shows how many teams are active in status bar!

### 6. Smart Selection

Double-click to auto-select:
- URLs (including localhost:3847)
- File paths
- Git hashes
- IP addresses

### 7. Composing Messages

**iTerm2 → Settings → Profiles → Keys**
Map `⌘⏎` to "Send Text: \n"

Allows multi-line input for Claude without immediate send.

## 🔧 Troubleshooting

### Dashboard Won't Start
```bash
# Check if port is busy
lsof -i :3847

# Kill process if needed
kill -9 $(lsof -t -i :3847)

# Try starting dashboard
./start.sh
```

### Can't See Agent Panes
```bash
# Verify it2 CLI
which it2

# Install if missing
npm install -g it2

# Enable Python API
# iTerm2 → Settings → General → Magic → Enable Python API

# Restart iTerm2 completely
killall iTerm2
open -a iTerm
```

### WebSocket Won't Connect
```bash
# Check server is running
curl http://localhost:3847/api/health

# Check firewall
# System Settings → Network → Firewall
# Allow Node.js connections

# Try different browser
# Chrome, Firefox, Safari
```

### Splits Look Broken
```bash
# Reset window arrangement
⌘⇧⏎  # Maximize current pane
⌘⇧I   # Edit Current Session
# Adjust columns/rows

# Or close all panes and start fresh
⌘W (on each pane)
```

## 📖 Quick Reference

### iTerm2 Keyboard Shortcuts
```
# Essential
⌘T         # New tab
⌘D         # Split vertically
⌘⇧D        # Split horizontally
⌘[/]       # Navigate splits
⌘⇧⏎        # Maximize pane
⌘W         # Close pane/tab
⌘K         # Clear
⌘F         # Find
⌘/         # Show cursor

# Advanced
⌘⌥B        # Instant replay
⌘⌥E        # Expose tabs
⌘⇧H        # Paste history
⌘;         # Autocomplete
```

### Surveillance Commands
```bash
# Start dashboard
cd ~/Documents/GitHub/agent-surveillance && ./start.sh

# Check health
curl http://localhost:3847/api/health

# List teams
curl http://localhost:3847/api/teams | jq .

# Open in browser
open http://localhost:3847
```

## 🎁 Bonus: iTerm2 Scripts

### Auto-Launch Script

Save as `~/launch-agent-dev.sh`:
```bash
#!/bin/bash

# Launch iTerm2 with agent development setup

# Create new iTerm2 window with splits
it2 create-tab
it2 send-text "cd ~/Documents/GitHub/agent-surveillance && ./start.sh"

# Split and start monitoring
it2 split-pane --vertical
it2 send-text "sleep 3 && open http://localhost:3847"
it2 send-text "watch -n 2 'curl -s http://localhost:3847/api/teams | jq .'"

# Create tab for project
it2 create-tab
it2 send-text "cd ~/your-project && claude"

echo "✅ Agent development environment ready!"
```

**Usage:**
```bash
chmod +x ~/launch-agent-dev.sh
./launch-agent-dev.sh
```

## 🚀 Advanced: iTerm2 + Python API

Write custom scripts to control iTerm2:

**monitor_teams.py:**
```python
#!/usr/bin/env python3
import iterm2
import asyncio
import requests

async def main(connection):
    app = await iterm2.async_get_app(connection)
    window = app.current_window

    # Fetch active teams
    response = requests.get('http://localhost:3847/api/teams')
    teams = response.json()['teams']

    # Create tab for each team
    for team in teams:
        await window.async_create_tab()
        session = app.current_terminal_window.current_tab.current_session
        await session.async_send_text(f"echo 'Monitoring {team['name']}'\n")

        # Set badge
        await session.async_set_badge_format(f"🤖 {team['name']}")

iterm2.run_until_complete(main)
```

**Run:**
```bash
python3 monitor_teams.py
```

Creates a tab for each active team automatically!

---

**Master iTerm2 + Agent Teams for the ultimate macOS terminal experience!** 🖥️🤖

**Questions?** Check [README.md](../README.md), [WARP-GUIDE.md](./WARP-GUIDE.md), or [TMUX-GUIDE.md](./TMUX-GUIDE.md)
