'use client';

interface Team {
  name: string;
  config?: any;
}

interface TeamSelectorProps {
  teams: Team[];
  selectedTeam: string | null;
  onSelectTeam: (teamName: string) => void;
}

export default function TeamSelector({ teams, selectedTeam, onSelectTeam }: TeamSelectorProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-4">
      <label className="block text-sm font-medium mb-2">Active Teams</label>
      <div className="flex gap-2 flex-wrap">
        {teams.length === 0 ? (
          <div className="text-gray-500 text-sm">
            No active teams. Create an agent team in Claude Code to see it here.
          </div>
        ) : (
          teams.map((team) => (
            <button
              key={team.name}
              onClick={() => onSelectTeam(team.name)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTeam === team.name
                  ? 'bg-claude-purple text-white'
                  : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {team.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
