# Known Issues

This document tracks known issues and bugs related to Claude Code Agent Teams that you may encounter while using the agent-surveillance dashboard.

---

## Agent Teams Inbox Polling Bug & Fix

### Issue Description

**Problem:** After exiting and restarting a Claude Code session, the Agent Teams inbox polling mechanism fails to reinitialize. Messages from teammates are written to inbox files but never delivered to the team lead, breaking automatic message delivery.

**Affected Version:** Claude Code 2.1.39 (and likely earlier versions)

**Related GitHub Issues:**
- https://github.com/anthropics/claude-code/issues/24108
- https://github.com/anthropics/claude-code/issues/23465
- https://github.com/anthropics/claude-code/issues/23415

### Symptoms

1. **Before session exit:** Inbox polling works correctly (visible in debug logs every 1 second)
2. **After session restart:**
   - Teammates can send messages (written to `~/.claude/teams/{team}/inboxes/team-lead.json`)
   - Messages show `"read": false` in inbox JSON
   - Team lead never receives automatic notification
   - No inbox polling in debug logs (`readMailbox` calls stop)
   - Teammates remain idle waiting for responses

### How to Diagnose

Check your debug log for inbox polling activity:

```bash
# Find your current session ID
ls -lt ~/.claude/debug/ | head -2

# Check for inbox polling (should see reads every ~1 second when working)
grep "readMailbox.*team-lead" ~/.claude/debug/{session-id}.txt | tail -20

# Check if teammates sent messages
cat ~/.claude/teams/{team-name}/inboxes/team-lead.json | jq '.[] | select(.read == false)'
```

If you see:
- ✅ Old polling logs but none recent → Polling stopped
- ✅ Unread messages in inbox → Messages are being written but not delivered
- ✅ Teammates asking "can you receive my messages?" → Classic symptom

### The Fix

**Simple solution:** Fully restart Claude Code and tmux

```bash
# 1. Exit Claude Code (Ctrl+C or /exit)

# 2. Kill all Claude processes
pkill -f "claude"

# 3. Kill tmux server (if using tmux)
tmux kill-server

# 4. Wait a few seconds
sleep 5

# 5. Restart fresh
tmux
claude
```

**Verification:** After restart, test with a simple agent:

```
// In Claude Code:
1. Create a test team: TeamCreate
2. Spawn a test agent with simple task: "Send me a test message"
3. Wait ~10 seconds
4. If you receive the message automatically → polling is working ✅
```

### Root Cause

The inbox polling mechanism is tied to session lifecycle and doesn't properly reinitialize when a session resumes with an existing team. The polling loop that checks for new messages (`TeammateMailbox.readMailbox()`) is never restarted after the session ends.

According to the GitHub issues, polling only activates between conversation turns, and initial idle agents never enter the polling loop.

### Workarounds (If Restart Doesn't Work)

1. **Manual polling:** Read inbox files directly (not recommended - defeats automation)
2. **Delete and recreate teams:** Force fresh initialization (loses agent state)
3. **Keep sessions running:** Don't exit Claude Code while using Agent Teams
4. **Upgrade Claude Code:** Check for updates with `claude update`

### Best Practices

- Don't exit team lead sessions until all agents are shut down
- Use `/shutdown` properly before exiting
- Clean up teams with `TeamDelete` when done
- Monitor debug logs when debugging issues
- Keep Claude Code updated - this is an experimental feature with active development

### Verification Script

Quick script to check if inbox polling is active:

```bash
#!/bin/bash
# Quick check if inbox polling is active

SESSION_LOG=$(ls -t ~/.claude/debug/*.txt | head -1)
RECENT_POLLS=$(grep "readMailbox.*team-lead" "$SESSION_LOG" | tail -1)

if [ -z "$RECENT_POLLS" ]; then
    echo "❌ No inbox polling detected"
    echo "💡 Try restarting Claude Code"
else
    LAST_POLL=$(echo "$RECENT_POLLS" | cut -d' ' -f1)
    echo "✅ Last inbox poll: $LAST_POLL"
fi
```

### Status

This is a known bug in the experimental Agent Teams feature. The Anthropic team is aware of the issue. Until a permanent fix is released, the restart workaround is the most reliable solution.

---

**Last Updated:** February 2026
**Tested With:** Claude Code 2.1.39
**Feature Status:** Experimental (enabled via `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`)
