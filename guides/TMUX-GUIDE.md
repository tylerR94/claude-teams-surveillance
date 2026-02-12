# 🖥️ Using Claude Agent Teams with tmux

Complete guide to running agent teams with tmux split panes and the surveillance dashboard.

## Why tmux?

tmux is the classic choice for terminal multiplexing:
- ✅ True split-pane support (native)
- ✅ Session persistence (survives disconnects)
- ✅ Scriptable layouts
- ✅ Works over SSH
- ✅ Battle-tested and stable

---

## ⚠️ CRITICAL: Enable Mouse Support First!

**Before using tmux with Agent Teams, you MUST enable mouse support!**

### The Problem

By default, tmux doesn't allow clicking between panes. You'll be stuck using keyboard shortcuts (`Ctrl+b` + arrow keys) which is frustrating when working with multiple agents.

### The Solution

**Add this to your `~/.tmux.conf` file:**

```bash
# Edit your tmux config
nano ~/.tmux.conf

# Add this line:
# Enable mouse support (click panes, resize, scroll)
set -g mouse on

# Save and exit (Ctrl+X, then Y, then Enter)
```

**Then reload tmux:**

```bash
# If you're in a tmux session:
tmux source-file ~/.tmux.conf

# Or restart tmux completely:
tmux kill-server
tmux
```

### Verify It Works

After reloading, you should be able to:
- ✅ Click between panes to switch focus
- ✅ Click and drag pane borders to resize
- ✅ Scroll with your mouse wheel

**If clicking still doesn't work:**
1. Check `~/.tmux.conf` has the line (no typos!)
2. Make sure you reloaded: `tmux source-file ~/.tmux.conf`
3. Try creating a fresh session: `tmux new -s test`

---

## 🚀 Quick Start

### 1. Install tmux

```bash
# macOS
brew install tmux

# Ubuntu/Debian
sudo apt-get install tmux

# Verify installation
tmux -V
```

### 2. Enable Agent Teams + tmux Mode

`~/.claude/settings.json`:
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "teammateMode": "tmux"
}
```

**Restart Claude Code after this!**

### 3. Start tmux Session

```bash
# Start a new tmux session
tmux new -s agent-surveillance

# Or attach to existing
tmux attach -t agent-surveillance
```

## 🎯 Recommended tmux Layout

### Option 1: Dashboard + Project Layout

```
┌─────────────────────────────────────────────────────────┐
│ tmux session: agent-surveillance                        │
├─────────────────────────────────────────────────────────┤
│ Window 0: Dashboard           [●] 1:Project 2:Teams     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🔍 Claude Agent Surveillance Dashboard                 │
│  Server: http://localhost:3847                          │
│  Status: 🟢 Running                                      │
│                                                          │
│  Watching:                                              │
│  📝 Team update: web-app-build                          │
│  ✅ Task update: Task #2 started                        │
│  💬 New message: developer → team-lead                  │
│                                                          │
└─────────────────────────────────────────────────────────┘

Switch windows: Ctrl+b, then 0/1/2
```

### Option 2: Split Pane Layout

```
┌──────────────────────────────┬─────────────────────────┐
│ Pane 0: Surveillance         │ Pane 1: Claude Code     │
│ Dashboard Server             │ (Team Lead)             │
│                              │                         │
│ 🔍 Running on :3847          │ $ claude                │
│ 📊 2 active teams            │                         │
│ 💬 15 messages               │ Create an agent team    │
│                              │ to build...             │
├──────────────────────────────┼─────────────────────────┤
│ Pane 2: Browser/Logs         │ Pane 3: File Watcher    │
│                              │                         │
│ $ open localhost:3847        │ $ watch -n 1 \          │
│ $ tail -f server.log         │   'ls ~/.claude/teams/' │
│                              │                         │
└──────────────────────────────┴─────────────────────────┘

Navigate panes: Ctrl+b, then arrow keys
```

## 📋 tmux Basics (Quick Refresher)

### Essential Commands

```bash
# Session management
tmux new -s session-name     # New session
tmux attach -t session-name  # Attach to session
tmux ls                      # List sessions
tmux detach                  # Detach (Ctrl+b, d)

# Windows (like tabs)
Ctrl+b, c    # Create new window
Ctrl+b, n    # Next window
Ctrl+b, p    # Previous window
Ctrl+b, 0-9  # Switch to window by number
Ctrl+b, ,    # Rename window

# Panes (splits)
Ctrl+b, %    # Split vertically
Ctrl+b, "    # Split horizontally
Ctrl+b, →    # Move to pane (arrow keys)
Ctrl+b, x    # Kill pane
Ctrl+b, z    # Zoom pane (toggle fullscreen)

# Other
Ctrl+b, ?    # Show all key bindings
Ctrl+b, [    # Scroll mode (q to exit)
```

## 🎨 Recommended Workflows

### Workflow 1: Single Project with Surveillance

**Setup:**
```bash
# Start tmux
tmux new -s dev-session

# Window 0: Dashboard (leave running)
cd ~/Documents/GitHub/agent-surveillance
./start.sh

# Create new window for project
Ctrl+b, c

# Window 1: Project work
cd ~/your-project
claude

# Create new window for monitoring
Ctrl+b, c

# Window 2: Monitor teams
watch -n 2 'curl -s http://localhost:3847/api/teams | jq .'
```

**Navigate:**
- `Ctrl+b, 0` - View dashboard
- `Ctrl+b, 1` - Work in project
- `Ctrl+b, 2` - Check team status

### Workflow 2: Multi-Pane Development

**Setup:**
```bash
# Start tmux
tmux new -s agent-dev

# Create 4-pane layout
tmux split-window -h    # Split horizontally (left/right)
tmux split-window -v    # Split bottom-right vertically
tmux select-pane -t 0
tmux split-window -v    # Split top-left vertically

# Now you have 4 panes:
# ┌─────────┬─────────┐
# │ 0       │ 1       │
# ├─────────┤         │
# │ 2       ├─────────┤
# └─────────┴ 3       │
#           └─────────┘

# Pane 0: Dashboard
cd ~/Documents/GitHub/agent-surveillance && ./start.sh

# Pane 1: Claude Code (Ctrl+b, arrow right)
cd ~/your-project && claude

# Pane 2: Logs (Ctrl+b, arrow down from pane 0)
tail -f server.log

# Pane 3: File watcher (Ctrl+b, arrow right then down)
watch -n 1 'ls -la ~/.claude/teams/'
```

### Workflow 3: Multiple Projects

**Setup:**
```bash
tmux new -s multi-project

# Window 0: Dashboard
cd ~/Documents/GitHub/agent-surveillance && ./start.sh
tmux rename-window 'Dashboard'

# Window 1: Project A
Ctrl+b, c
cd ~/project-a && claude
tmux rename-window 'Project-A'

# Window 2: Project B
Ctrl+b, c
cd ~/project-b && claude
tmux rename-window 'Project-B'

# Window 3: Monitoring
Ctrl+b, c
htop  # or watch, or logs
tmux rename-window 'Monitor'
```

**Status bar shows:**
```
[Dashboard*] [Project-A] [Project-B] [Monitor]
```

## 🔧 tmux Configuration

Create `~/.tmux.conf` for better experience:

```bash
# ~/.tmux.conf - Better tmux for agent teams

# Use Ctrl+a instead of Ctrl+b (easier to type)
unbind C-b
set -g prefix C-a
bind C-a send-prefix

# Split panes using | and -
bind | split-window -h
bind - split-window -v
unbind '"'
unbind %

# Switch panes using Alt+arrow without prefix
bind -n M-Left select-pane -L
bind -n M-Right select-pane -R
bind -n M-Up select-pane -U
bind -n M-Down select-pane -D

# Enable mouse support (click to switch panes)
set -g mouse on

# Start window numbering at 1
set -g base-index 1
set -g pane-base-index 1

# Renumber windows when one is closed
set -g renumber-windows on

# Increase scrollback buffer
set -g history-limit 10000

# Better status bar
set -g status-bg colour235
set -g status-fg colour136
set -g status-left '🤖 Agent Teams | '
set -g status-right ' %H:%M %d-%b-%y'

# Highlight active window
setw -g window-status-current-style fg=colour166,bg=colour235,bold

# Reload config
bind r source-file ~/.tmux.conf \; display "Config reloaded!"

# Clear screen
bind C-l send-keys 'C-l'

# Don't exit tmux when closing a session
set -g detach-on-destroy off
```

**Apply config:**
```bash
tmux source-file ~/.tmux.conf
```

## 🎯 Agent Teams with tmux Split Panes

When you create an agent team with `teammateMode: "tmux"`, Claude Code automatically creates split panes for each teammate!

### How It Works

**1. Start tmux:**
```bash
tmux new -s agent-work
```

**2. Start Claude Code in tmux:**
```bash
claude
```

**3. Create a team:**
```
Create an agent team with 3 developers to build a dashboard
```

**4. Watch tmux auto-split:**
```
┌─────────────────┬─────────────────┬─────────────────┐
│ Team Lead       │ Developer 1     │ Developer 2     │
│ (main session)  │ (teammate)      │ (teammate)      │
│                 │                 │                 │
│ Managing team   │ Building UI     │ Building API    │
└─────────────────┴─────────────────┴─────────────────┘
                  │ Developer 3     │
                  │ (teammate)      │
                  │                 │
                  │ Writing tests   │
                  └─────────────────┘
```

Each pane is a separate Claude Code session working on its assigned task!

## 📊 Surveillance + tmux Integration

### Best Practice Layout

**tmux session structure:**
```
Session: agent-surveillance
├── Window 0: Dashboard (always on)
│   └── Pane: Running ./start.sh
├── Window 1: Project Work
│   ├── Pane 0: Team Lead (Claude Code)
│   ├── Pane 1: Teammate 1 (auto-created)
│   ├── Pane 2: Teammate 2 (auto-created)
│   └── Pane 3: Teammate 3 (auto-created)
└── Window 2: Browser + Logs
    ├── Pane 0: Open localhost:3847
    └── Pane 1: tail -f logs
```

### Quick Setup Script

Save as `~/setup-agent-tmux.sh`:
```bash
#!/bin/bash

SESSION="agent-surveillance"

# Create session
tmux new-session -d -s $SESSION -n Dashboard

# Window 0: Dashboard
tmux send-keys -t $SESSION:0 "cd ~/Documents/GitHub/agent-surveillance && ./start.sh" C-m

# Window 1: Project
tmux new-window -t $SESSION:1 -n Project
tmux send-keys -t $SESSION:1 "cd ~/your-project" C-m

# Window 2: Monitoring
tmux new-window -t $SESSION:2 -n Monitor
tmux send-keys -t $SESSION:2 "watch -n 2 'curl -s http://localhost:3847/api/teams | jq .'" C-m

# Split window 2
tmux split-window -h -t $SESSION:2
tmux send-keys -t $SESSION:2.1 "htop" C-m

# Attach to session
tmux attach -t $SESSION:1
```

**Usage:**
```bash
chmod +x ~/setup-agent-tmux.sh
./setup-agent-tmux.sh
```

## 💡 Pro Tips

### 1. Named Sessions
Use descriptive session names:
```bash
tmux new -s web-app-team
tmux new -s api-refactor-team
tmux new -s bug-investigation

# List all
tmux ls
```

### 2. Session Templates
Create reusable layouts with tmuxinator:
```bash
brew install tmuxinator

# Create template
tmuxinator new agent-dev
```

**~/.config/tmuxinator/agent-dev.yml:**
```yaml
name: agent-dev
root: ~/Documents/GitHub/agent-surveillance

windows:
  - dashboard:
      layout: main-vertical
      panes:
        - ./start.sh
  - project:
      root: ~/your-project
      panes:
        - claude
  - monitor:
      layout: even-horizontal
      panes:
        - watch -n 2 'curl -s http://localhost:3847/api/teams | jq .'
        - htop
```

**Start with:**
```bash
tmuxinator start agent-dev
```

### 3. Persistent Sessions
tmux sessions survive disconnects:
```bash
# Detach: Ctrl+b, d
# Sessions keep running in background

# SSH into another machine
ssh your-server

# Attach back
tmux attach -t agent-surveillance

# Everything still running!
```

### 4. Copy/Paste in tmux
```bash
# Enter copy mode
Ctrl+b, [

# Navigate with arrow keys
# Start selection: Space
# Copy selection: Enter

# Paste
Ctrl+b, ]
```

### 5. Zoom Pane
Focus on one pane without closing others:
```bash
Ctrl+b, z    # Zoom in/out (toggle)
```

Perfect for reading agent output!

## 🔧 Troubleshooting

### Panes Not Auto-Creating
```bash
# 1. Verify tmux mode in settings
cat ~/.claude/settings.json | jq .teammateMode

# 2. Must be IN tmux when creating team
echo $TMUX    # Should show a value

# 3. Restart Claude Code
```

### Split Panes Look Weird
```bash
# Rearrange panes
Ctrl+b, Space    # Cycle through layouts

# Or manually resize
Ctrl+b, :
resize-pane -D 5    # Down 5 lines
resize-pane -U 5    # Up 5 lines
resize-pane -R 5    # Right 5 columns
resize-pane -L 5    # Left 5 columns
```

### Can't See Dashboard in Browser
```bash
# tmux blocks don't affect browser
# Just open in any browser:
open http://localhost:3847

# Or use text-based browser in tmux
brew install lynx
lynx http://localhost:3847
```

## 📖 Quick Reference

### Surveillance Dashboard Commands
```bash
# Start in tmux window
tmux new-window -n Dashboard
cd ~/Documents/GitHub/agent-surveillance && ./start.sh

# Check status
tmux send-keys -t Dashboard "curl http://localhost:3847/api/health" C-m

# View in browser
open http://localhost:3847
```

### tmux Cheat Sheet
```bash
# Sessions
tmux new -s name         # New session
tmux attach -t name      # Attach
tmux ls                  # List
tmux kill-session -t name # Kill

# Windows
Ctrl+b, c    # New window
Ctrl+b, ,    # Rename
Ctrl+b, n/p  # Next/previous
Ctrl+b, 0-9  # Switch by number

# Panes
Ctrl+b, %    # Split vertical
Ctrl+b, "    # Split horizontal
Ctrl+b, →    # Move (arrows)
Ctrl+b, z    # Zoom
Ctrl+b, x    # Kill pane

# Other
Ctrl+b, d    # Detach
Ctrl+b, ?    # Help
Ctrl+b, [    # Scroll mode
```

## 🚀 Advanced: tmux + Surveillance API

Monitor directly from tmux:

```bash
# Window with API monitoring
tmux new-window -n 'API Monitor'

# Split into 3 panes
tmux split-window -h
tmux split-window -v
tmux select-pane -t 0
tmux split-window -v

# Pane 0: Active teams
tmux send-keys -t 0 "watch -n 2 'curl -s http://localhost:3847/api/teams | jq \".teams[].name\"'" C-m

# Pane 1: Task counts
tmux send-keys -t 1 "watch -n 2 'curl -s http://localhost:3847/api/teams | jq \".teams[].tasks | length\"'" C-m

# Pane 2: Message feed
tmux send-keys -t 2 "watch -n 2 'curl -s http://localhost:3847/api/teams | jq \".teams[].messages[-5:] | .[].content\"'" C-m

# Pane 3: System resources
tmux send-keys -t 3 "htop" C-m
```

## 🎁 Bonus: tmux in Warp

Yes, you can use tmux INSIDE Warp!

```bash
# In Warp terminal
tmux new -s agent-work

# Now you get:
# - Warp's modern UI and AI
# - tmux's split panes and persistence
# - Best of both worlds!
```

---

**Master tmux + Agent Teams for ultimate control!** 🖥️🤖

**Questions?** Check [README.md](../README.md) or [WARP-GUIDE.md](./WARP-GUIDE.md)
