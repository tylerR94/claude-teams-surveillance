#!/bin/bash
# Quick setup script for agent-surveillance

set -e  # Exit on error

echo "🚀 Setting up Agent Surveillance Dashboard..."
echo ""

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
    echo "❌ Claude Code not found. Install it first: https://code.claude.com"
    exit 1
fi
echo "✅ Claude Code found"

# Check if agent teams are enabled
if [ -f ~/.claude/settings.json ]; then
    if ! grep -q "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS" ~/.claude/settings.json; then
        echo "⚠️  Agent Teams not enabled in settings.json"
        echo "   You'll need to add this manually or let me append it..."
        read -p "   Append to settings.json? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Backup existing settings
            cp ~/.claude/settings.json ~/.claude/settings.json.backup
            # This is a simple append - users may need to merge manually if they have complex configs
            echo "⚠️  Note: This will append to your existing settings. You may need to merge JSON manually."
            echo '  "env": {' >> ~/.claude/settings.json
            echo '    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"' >> ~/.claude/settings.json
            echo '  }' >> ~/.claude/settings.json
            echo "✅ Agent Teams enabled. Backup saved to ~/.claude/settings.json.backup"
            echo "   ⚠️  Please restart Claude Code and verify settings.json is valid JSON!"
        fi
    else
        echo "✅ Agent Teams already enabled"
    fi
else
    echo "⚠️  ~/.claude/settings.json not found. Creating it..."
    mkdir -p ~/.claude
    echo '{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}' > ~/.claude/settings.json
    echo "✅ Created ~/.claude/settings.json with Agent Teams enabled"
    echo "   Please restart Claude Code!"
fi

# Check for tmux and enable mouse support
if command -v tmux &> /dev/null; then
    echo "✅ tmux found"
    if [ -f ~/.tmux.conf ]; then
        if ! grep -q "set -g mouse on" ~/.tmux.conf; then
            echo "⚠️  tmux mouse support not enabled. Adding now..."
            echo "" >> ~/.tmux.conf
            echo "# Enable mouse support (click panes, resize, scroll)" >> ~/.tmux.conf
            echo "set -g mouse on" >> ~/.tmux.conf
            echo "✅ Mouse support added to ~/.tmux.conf"
            echo "   Run: tmux source-file ~/.tmux.conf (or restart tmux)"
        else
            echo "✅ tmux mouse support already enabled"
        fi
    else
        echo "⚠️  ~/.tmux.conf not found. Creating it..."
        echo "# Enable mouse support (click panes, resize, scroll)" > ~/.tmux.conf
        echo "set -g mouse on" >> ~/.tmux.conf
        echo "✅ Created ~/.tmux.conf with mouse support enabled"
    fi
else
    echo "ℹ️  tmux not found (that's okay if you're using Warp or iTerm2)"
fi

echo ""
echo "📦 Installing dependencies..."

# Install dependencies
if command -v bun &> /dev/null; then
    echo "✅ Using Bun (faster!)"
    bun install
elif command -v npm &> /dev/null; then
    echo "✅ Using npm"
    npm install
else
    echo "❌ Neither Bun nor npm found. Please install Node.js or Bun first."
    exit 1
fi

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║  ✅ Setup Complete!                                   ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Choose your terminal setup:"
echo "   📖 Getting Started:  cat GETTING_STARTED.md"
echo "   🌊 Warp Guide:       cat guides/WARP-GUIDE.md"
echo "   🖥️  tmux Guide:       cat guides/TMUX-GUIDE.md"
echo "   🖥️  iTerm2 Guide:     cat guides/ITERM2-GUIDE.md"
echo ""
echo "2. Start the dashboard:"
if command -v bun &> /dev/null; then
    echo "   bun run dev"
else
    echo "   npm run dev"
fi
echo ""
echo "3. Open in browser:"
echo "   http://localhost:3847"
echo ""
echo "4. Create an agent team in Claude Code:"
echo "   claude"
echo "   'Create an agent team to...'"
echo ""
echo "💡 Tip: If you use tmux and just enabled mouse support,"
echo "   restart tmux to apply: tmux kill-server && tmux"
echo ""
