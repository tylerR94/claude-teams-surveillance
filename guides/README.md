# 📚 Terminal Setup Guides for Claude Agent Teams

Complete guides for using Claude Agent Teams with different terminal setups.

## 📖 Available Guides

### [🌊 Warp Terminal Guide](./WARP-GUIDE.md)
**Best for:** Beginners, modern UI lovers, tab-based workflows

Learn how to use agent teams in Warp with:
- Tab-based organization
- Warp AI integration
- Command palette workflows
- Surveillance dashboard integration

**Difficulty:** 🟢 Easy

---

### [🖥️ tmux Guide](./TMUX-GUIDE.md)
**Best for:** Power users, remote work, session persistence

Master agent teams with tmux:
- Split-pane workflows
- Session management
- Scriptable layouts
- Remote work over SSH

**Difficulty:** 🟡 Moderate

---

### [🖥️ iTerm2 Guide](./ITERM2-GUIDE.md)
**Best for:** macOS users, native split panes, advanced features

Optimize agent teams with iTerm2:
- Native macOS splits
- Hotkey window setup
- Custom profiles and triggers
- Python API scripting

**Difficulty:** 🟡 Moderate

---

### [🤔 Comparison Guide](./COMPARISON.md)
**Not sure which to choose?**

Compare all three terminals:
- Feature comparison matrix
- Use case recommendations
- Setup time and difficulty
- Migration guide

---

## 🚀 Quick Start by Experience Level

### Beginner (Never used agent teams before)
👉 Start here: [Warp Guide](./WARP-GUIDE.md)
- Easiest setup
- Modern, visual interface
- Works great with surveillance dashboard

### Intermediate (Comfortable with terminals)
👉 Try: [iTerm2 Guide](./ITERM2-GUIDE.md) (macOS) or [Warp Guide](./WARP-GUIDE.md) (any OS)
- More features without complexity
- Good balance of power and usability

### Advanced (Want maximum control)
👉 Master: [tmux Guide](./TMUX-GUIDE.md)
- Most powerful
- Highly customizable
- Works everywhere

---

## 🎯 Quick Decision Tree

**Choose based on your needs:**

```
Do you work remotely / over SSH?
├─ Yes → Use tmux
└─ No ↓

Are you on macOS?
├─ Yes ↓
│  └─ Want native features?
│     ├─ Yes → Use iTerm2
│     └─ No → Use Warp
└─ No → Use Warp or tmux

Want the easiest setup?
└─ Use Warp (works for 90% of cases)
```

---

## 🎨 All Work with Surveillance Dashboard

**Important:** All three terminals work perfectly with the surveillance dashboard!

```bash
# Same dashboard for all terminals
cd ~/Documents/GitHub/agent-surveillance
./start.sh

# Dashboard runs at http://localhost:3847
# Works regardless of terminal choice
```

---

## 📊 Feature Comparison (Quick)

| Feature | Warp | tmux | iTerm2 |
|---------|------|------|--------|
| Ease of Use | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Split Panes | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Session Persistence | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Modern UI | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐ |
| Customization | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**See full comparison:** [COMPARISON.md](./COMPARISON.md)

---

## 💡 Pro Tip

**You can combine them!**
- Run tmux inside Warp or iTerm2
- Get modern UI + powerful multiplexing
- Best of both worlds

```bash
# In Warp or iTerm2
tmux new -s agent-dev

# Now you have:
# ✅ Beautiful terminal UI
# ✅ Powerful tmux features
# ✅ Session persistence
```

---

## 🆘 Need Help?

1. **Read the guide** for your chosen terminal
2. **Check the comparison** if you're not sure which to use
3. **Try Warp first** - it's the easiest
4. **Experiment** - switching is easy, dashboard works with all

---

## 📖 More Documentation

- [Main README](../README.md) - Project overview
- [Quick Start](../QUICKSTART.md) - Get started in 2 minutes
- [Installation](../INSTALL.md) - Installation troubleshooting

---

**Happy monitoring with Claude Agent Teams!** 🤖✨
