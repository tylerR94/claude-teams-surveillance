# Installation Guide

## Quick Fix: Use Bun (Recommended)

Bun handles native modules better and is much faster:

```bash
# Install Bun if you don't have it
curl -fsSL https://bun.sh/install | bash

# Install dependencies with Bun
cd ~/Documents/GitHub/agent-surveillance
bun install

# Run the dashboard
bun run dev
```

## Option 2: Use Node LTS (v20)

If you prefer npm, switch to Node v20 LTS which has better native module support:

```bash
# Switch to Node v20 LTS
nvm install 20
nvm use 20

# Install dependencies
cd ~/Documents/GitHub/agent-surveillance
npm install

# Run the dashboard
npm run dev
```

## Option 3: Lite Version (No SQLite)

If you just want to get started quickly without history persistence, use the lite version:

```bash
cd ~/Documents/GitHub/agent-surveillance

# Install without SQLite
npm install --omit=optional

# The app will use in-memory storage instead
npm run dev
```

## Troubleshooting

### Better-sqlite3 compilation fails

This is due to Node.js v23 having breaking changes for native modules. Solutions:
1. **Use Bun** (fastest, recommended)
2. **Use Node v20 LTS** (stable, well-supported)
3. **Use lite version** without SQLite

### Port 3847 already in use

```bash
# Check what's using the port
lsof -i :3847

# Kill the process or use a different port
PORT=8080 npm run dev
```

### Permission errors on ~/.claude/

```bash
# Fix permissions
chmod -R u+rw ~/.claude/
```

## Verify Installation

Once installed, you should see:

```
╔═══════════════════════════════════════════════════════════╗
║   🔍 Claude Agent Team Surveillance Dashboard             ║
╠═══════════════════════════════════════════════════════════╣
║   Server:     http://localhost:3847                       ║
║   WebSocket:  ws://localhost:3847                         ║
║   Status:     🟢 Running                                   ║
╚═══════════════════════════════════════════════════════════╝
```

Open http://localhost:3847 in your browser to see the dashboard.
