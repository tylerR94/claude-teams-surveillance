# 🤔 Terminal Comparison for Claude Agent Teams

**Which terminal setup is right for you?** This guide compares Warp, tmux, and iTerm2 for agent team workflows.

## Quick Decision Tree

```
Start here: What's your priority?
│
├─ "I want the easiest setup"
│  └─ ✅ Use Warp (modern, simple, works out of box)
│
├─ "I need session persistence / work over SSH"
│  └─ ✅ Use tmux (sessions survive disconnects)
│
├─ "I'm on macOS and want native features"
│  └─ ✅ Use iTerm2 (best macOS integration)
│
├─ "I want to see all agents at once"
│  ├─ Native split support? → tmux or iTerm2
│  └─ Prefer tabs? → Warp
│
└─ "I'm not sure"
   └─ Start with Warp + Surveillance Dashboard
      (Easiest, most modern, works for 90% of cases)
```

## Feature Comparison

| Feature | Warp | tmux | iTerm2 |
|---------|------|------|--------|
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Modern UI** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐ |
| **Split Panes** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Session Persistence** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **SSH Support** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Customization** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Learning Curve** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **AI Features** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ |
| **Cross-Platform** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ (macOS only) |
| **Agent Team Support** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## Detailed Comparison

### 🌊 Warp

**Best For:**
- Beginners to agent teams
- Modern, clean UI preference
- Wanting AI assistance
- Simple tab-based workflow

**Pros:**
- ✅ Beautiful, modern interface
- ✅ Built-in AI assistant (ask questions!)
- ✅ Command palette (⌘K)
- ✅ Command blocks (organized output)
- ✅ Zero configuration needed
- ✅ Excellent for surveillance dashboard workflow
- ✅ Native macOS and Linux support
- ✅ Auto-saves session state

**Cons:**
- ❌ Split panes not as powerful as tmux/iTerm2
- ❌ Agent panes don't auto-create (use tabs instead)
- ❌ Sessions don't persist across restarts
- ❌ Requires Warp-specific features

**Agent Team Workflow:**
```bash
# Tab 1: Dashboard (always on)
cd ~/Documents/GitHub/agent-surveillance && ./start.sh

# Tab 2: Project (in-process mode)
cd ~/your-project && claude
"Create an agent team..."

# Tab 3: Optional monitoring
watch -n 2 'curl localhost:3847/api/teams | jq .'
```

**Recommendation:**
- Use **in-process mode** (agents in one terminal, switch with Shift+Up/Down)
- Rely on **surveillance dashboard** for visual monitoring
- Use **tabs** for organization, not splits

**Setup Difficulty:** 🟢 Easy (5 minutes)

**See Full Guide:** [WARP-GUIDE.md](./WARP-GUIDE.md)

---

### 🖥️ tmux

**Best For:**
- Advanced users
- Remote work over SSH
- Session persistence needs
- Maximum control and customization
- Cross-platform workflows

**Pros:**
- ✅ Sessions persist across disconnects
- ✅ Incredibly powerful split-pane system
- ✅ Works perfectly over SSH
- ✅ Highly scriptable and customizable
- ✅ Cross-platform (Linux, macOS, WSL, BSD)
- ✅ Agent panes auto-create in splits
- ✅ Lightweight and fast
- ✅ Can use inside any terminal (including Warp!)

**Cons:**
- ❌ Steeper learning curve
- ❌ Less visually appealing by default
- ❌ Requires configuration for best experience
- ❌ Keyboard-driven (not mouse-friendly by default)

**Agent Team Workflow:**
```bash
# Start tmux session
tmux new -s agent-dev

# Window 0: Dashboard
cd ~/Documents/GitHub/agent-surveillance && ./start.sh

# Window 1: Project (agents auto-split into panes)
Ctrl+b, c
cd ~/your-project && claude
"Create an agent team..."
# Agents appear in separate tmux panes!

# Window 2: Monitoring
Ctrl+b, c
watch -n 2 'curl localhost:3847/api/teams | jq .'
```

**Recommendation:**
- Use **split-pane mode** (teammates in separate panes)
- Keep dashboard in **separate tmux window**
- Learn **essential keybindings** (Ctrl+b prefix)

**Setup Difficulty:** 🟡 Moderate (30 minutes with config)

**See Full Guide:** [TMUX-GUIDE.md](./TMUX-GUIDE.md)

---

### 🖥️ iTerm2

**Best For:**
- macOS users
- Beautiful UI + power user features
- Native split panes without tmux
- Hotkey window support
- Advanced customization

**Pros:**
- ✅ Best macOS terminal (native features)
- ✅ Beautiful, highly customizable UI
- ✅ Native split panes (no tmux needed)
- ✅ Agent panes auto-create (via it2 CLI)
- ✅ Hotkey window support
- ✅ Advanced features (triggers, profiles, arrangements)
- ✅ Python API for scripting
- ✅ Instant replay feature

**Cons:**
- ❌ macOS only
- ❌ Sessions don't persist across restarts
- ❌ Requires it2 CLI for agent auto-splits
- ❌ More resource-intensive than tmux

**Agent Team Workflow:**
```bash
# Start Claude Code in iTerm2
cd ~/your-project && claude

# Create team (panes auto-split!)
"Create an agent team..."
# Teammates appear in separate iTerm2 panes!

# Dashboard in hotkey window
# Press ⌘` → Dashboard appears/hides
```

**Recommendation:**
- Use **split-pane mode** (teammates in native splits)
- Set up **hotkey window** for dashboard (always accessible)
- Create **profiles** for different use cases

**Setup Difficulty:** 🟡 Moderate (20 minutes with it2 setup)

**See Full Guide:** [ITERM2-GUIDE.md](./ITERM2-GUIDE.md)

---

## Surveillance Dashboard Integration

### How Each Works with Dashboard

| Terminal | Dashboard Experience | Rating |
|----------|---------------------|--------|
| **Warp** | Separate tab, always visible via browser | ⭐⭐⭐⭐⭐ |
| **tmux** | Separate window, switch with Ctrl+b | ⭐⭐⭐⭐ |
| **iTerm2** | Hotkey window (⌘`) or separate tab | ⭐⭐⭐⭐⭐ |

**All three work perfectly with the surveillance dashboard!**

The dashboard runs independently and monitors ALL teams regardless of which terminal you use.

---

## Use Case Recommendations

### 🎯 "I'm new to agent teams"
**Recommended:** Warp
- Easiest setup
- Modern UI
- Surveillance dashboard in separate tab
- No tmux/split pane complexity

**Workflow:**
```
Warp Tab 1: Dashboard (./start.sh)
Warp Tab 2: Claude Code (in-process mode)
Browser: http://localhost:3847
```

---

### 🎯 "I work remotely / over SSH"
**Recommended:** tmux
- Sessions persist across disconnects
- Works over any SSH connection
- Attach/detach seamlessly

**Workflow:**
```bash
# On remote server
tmux new -s agent-remote

# Window 0: Dashboard (runs on remote)
./start.sh

# Window 1: Remote project work
claude
"Create an agent team..."

# Detach (Ctrl+b, d) and logout
# Later: Reattach and everything still running!
```

---

### 🎯 "I want to see all agents working simultaneously"
**Recommended:** tmux or iTerm2
- Native split panes
- Each agent in its own pane
- Watch progress in real-time

**tmux Workflow:**
```bash
tmux new -s multiview

# Create team → agents auto-split into panes
┌──────────┬──────────┬──────────┐
│ Lead     │ Agent 1  │ Agent 2  │
├──────────┴──────────┴──────────┤
│ Agent 3  │ Agent 4  │          │
└──────────┴──────────┴──────────┘
```

**iTerm2 Workflow:**
Same as tmux, but with native macOS splits!

---

### 🎯 "I'm on macOS and want the best experience"
**Recommended:** iTerm2 or Warp
- iTerm2: Most powerful macOS features
- Warp: Most modern and beautiful

**iTerm2:**
- Hotkey window for dashboard
- Native splits for agents
- Advanced customization

**Warp:**
- AI assistant
- Modern UI
- Simple tab workflow

---

### 🎯 "I work on multiple machines (Mac, Linux, WSL)"
**Recommended:** tmux
- Cross-platform
- Same keybindings everywhere
- Works in any terminal

**Workflow:**
```bash
# Same commands on Mac, Linux, WSL:
tmux new -s agent-dev
# ... identical workflow ...
```

---

### 🎯 "I want maximum control and customization"
**Recommended:** tmux + Warp/iTerm2 combo
- tmux: Powerful session management
- Warp/iTerm2: Beautiful UI

**Hybrid Workflow:**
```bash
# In Warp or iTerm2, start tmux
tmux new -s ultimate

# Now you get:
# - Warp/iTerm2 beautiful UI
# - tmux powerful multiplexing
# - Best of both worlds!
```

---

## Performance Comparison

### Resource Usage (Typical)

| Terminal | RAM | CPU | Startup Time |
|----------|-----|-----|--------------|
| Warp | ~200MB | Low | ~2s |
| tmux | ~20MB | Very Low | <1s |
| iTerm2 | ~150MB | Low | ~1.5s |

**tmux is the most lightweight**, but all three are perfectly fine for agent teams.

---

## Setup Time Comparison

### Minimal Setup (Just Works)

| Terminal | Time | What's Needed |
|----------|------|---------------|
| Warp | 5 min | Install Warp, enable agent teams |
| tmux | 10 min | Install tmux, basic config, enable agent teams |
| iTerm2 | 10 min | Install iTerm2 + it2, enable agent teams |

### Optimized Setup (Full Config)

| Terminal | Time | What's Included |
|----------|------|-----------------|
| Warp | 15 min | Custom aliases, workflows |
| tmux | 45 min | Full .tmux.conf, custom layouts, keybindings |
| iTerm2 | 30 min | Profiles, hotkey window, triggers, arrangements |

---

## Migration Guide

### Switching Between Terminals

**Good news:** The surveillance dashboard works with ALL terminals!

**Switching from Warp to tmux:**
```bash
# Same surveillance dashboard
# Just change agent team workflow from tabs to windows
```

**Switching from tmux to iTerm2:**
```bash
# Similar split-pane workflow
# More visual, less keyboard-driven
```

**Switching from iTerm2 to Warp:**
```bash
# Change from splits to tabs
# Rely more on surveillance dashboard
```

**You can even use multiple terminals simultaneously!**
- Dashboard in Warp
- Agent teams in tmux
- Monitoring in iTerm2

---

## Recommendation Matrix

| Your Situation | Recommended | Alternative |
|----------------|-------------|-------------|
| Beginner | Warp | iTerm2 |
| Advanced | tmux | tmux + Warp |
| macOS Only | iTerm2 | Warp |
| Remote Work | tmux | tmux + Warp |
| Multi-Platform | tmux | Warp |
| Want AI Help | Warp | iTerm2 + Scripts |
| Maximum Power | tmux | iTerm2 |

---

## Final Recommendations

### 🥇 Best Overall: **Warp**
- Modern, easy, works great with surveillance dashboard
- Perfect for 90% of users
- Especially good for beginners

### 🥈 Best Power User: **tmux**
- Maximum control and flexibility
- Works everywhere
- Session persistence

### 🥉 Best macOS: **iTerm2**
- Native macOS features
- Beautiful and powerful
- Great split-pane support

### 🏆 Ultimate Setup: **tmux + Warp**
- Run tmux inside Warp
- Best of both worlds
- Modern UI + powerful multiplexing

---

## Try Them All!

**Week 1:** Start with Warp (easiest)
**Week 2:** Try tmux (learn the power)
**Week 3:** Test iTerm2 (macOS native)
**Week 4:** Pick your favorite!

**Remember:** The surveillance dashboard works with ALL of them. Your choice of terminal doesn't limit what you can do with agent teams!

---

## Quick Start Commands

### Warp
```bash
# Install
brew install --cask warp

# Enable agent teams
echo '{"env":{"CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS":"1"}}' > ~/.claude/settings.json

# Start dashboard in one tab
cd ~/Documents/GitHub/agent-surveillance && ./start.sh

# Work in another tab
cd ~/your-project && claude
```

### tmux
```bash
# Install
brew install tmux

# Enable agent teams + tmux mode
echo '{"env":{"CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS":"1"},"teammateMode":"tmux"}' > ~/.claude/settings.json

# Start session
tmux new -s agent-dev

# Dashboard in window 0
cd ~/Documents/GitHub/agent-surveillance && ./start.sh

# Work in window 1
Ctrl+b, c
cd ~/your-project && claude
```

### iTerm2
```bash
# Install
brew install --cask iterm2
npm install -g it2

# Enable Python API in iTerm2 settings

# Enable agent teams + tmux mode (detects iTerm2)
echo '{"env":{"CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS":"1"},"teammateMode":"tmux"}' > ~/.claude/settings.json

# Work
cd ~/your-project && claude
```

---

**Still not sure?** Start with **Warp** - it's the easiest and works great!

**Questions?** Check the individual guides:
- [Warp Guide](./WARP-GUIDE.md)
- [tmux Guide](./TMUX-GUIDE.md)
- [iTerm2 Guide](./ITERM2-GUIDE.md)
