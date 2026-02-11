'use client';

interface Agent {
  name: string;
  agentType?: string;
  model?: string;
  status?: string;
}

interface AgentListProps {
  agents: Agent[];
}

export default function AgentList({ agents }: AgentListProps) {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'working':
        return 'status-active';
      case 'idle':
        return 'status-idle';
      case 'error':
        return 'status-error';
      default:
        return 'status-idle';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Team Members</h2>
      {agents.length === 0 ? (
        <p className="text-gray-500 text-sm">No agents in this team yet.</p>
      ) : (
        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-claude-purple to-claude-orange rounded-full flex items-center justify-center text-white font-bold">
                  {agent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {agent.agentType || 'unknown'} • {agent.model || 'unknown'}
                  </div>
                </div>
              </div>
              <span className={`status-badge ${getStatusColor(agent.status)}`}>
                {agent.status || 'idle'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
