'use client';

import { useEffect, useState } from 'react';
import { WebSocketClient } from '@/lib/websocket-client';
import TeamSelector from '@/components/TeamSelector';
import AgentList from '@/components/AgentList';
import KanbanBoard from '@/components/KanbanBoard';
import LiveActivity from '@/components/LiveActivity';

interface Team {
  name: string;
  config?: any;
  tasks?: any[];
  messages?: any;
}

interface TeamDetails {
  name: string;
  config?: any;
  agents: any[];
  tasks: any[];
  messages: any[];
  events: any[];
  session?: any;
}

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [view, setView] = useState<'live' | 'history'>('live');

  useEffect(() => {
    const ws = new WebSocketClient();

    ws.on('connected', () => {
      setConnectionStatus('connected');
      fetchTeams();
    });

    ws.on('disconnected', () => {
      setConnectionStatus('disconnected');
    });

    ws.on('initial:state', (data) => {
      if (data.teams) {
        setTeams(data.teams);
        if (data.teams.length > 0 && !selectedTeam) {
          setSelectedTeam(data.teams[0].name);
        }
      }
    });

    ws.on('team:update', (data) => {
      console.log('Team update received:', data);
      fetchTeams();
      if (selectedTeam) {
        fetchTeamDetails(selectedTeam);
      }
    });

    ws.on('task:update', () => {
      if (selectedTeam) {
        fetchTeamDetails(selectedTeam);
      }
    });

    ws.on('message:new', () => {
      if (selectedTeam) {
        fetchTeamDetails(selectedTeam);
      }
    });

    ws.connect();

    // Set up polling as backup (every 5 seconds)
    const pollInterval = setInterval(() => {
      if (selectedTeam) {
        fetchTeamDetails(selectedTeam);
      }
      fetchTeams();
    }, 5000);

    return () => {
      ws.disconnect();
      clearInterval(pollInterval);
    };
  }, [selectedTeam]);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamDetails(selectedTeam);
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3847';
      const response = await fetch(`${API_URL}/api/teams`);
      const data = await response.json();
      setTeams(data.teams || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchTeamDetails = async (teamName: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3847';
      const response = await fetch(`${API_URL}/api/teams/${teamName}`);
      const data = await response.json();
      setTeamDetails(data);
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };

  const handleTeamSelect = (teamName: string) => {
    setSelectedTeam(teamName);
  };

  const StatusIndicator = () => (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${
        connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
      }`} />
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-claude-purple to-claude-orange bg-clip-text text-transparent">
                Claude Agent Team Surveillance
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Real-time monitoring for your agent teams
              </p>
            </div>
            <StatusIndicator />
          </div>

          {/* View Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setView('live')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'live'
                  ? 'bg-white dark:bg-slate-800 shadow'
                  : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setView('history')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'history'
                  ? 'bg-white dark:bg-slate-800 shadow'
                  : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {view === 'live' ? (
          <>
            {/* Team Selector */}
            <TeamSelector
              teams={teams}
              selectedTeam={selectedTeam}
              onSelectTeam={handleTeamSelect}
            />

            {selectedTeam && teamDetails ? (
              <>
                {/* Session Info */}
                {teamDetails.session && (
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Team Name</div>
                        <div className="font-semibold">{teamDetails.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Started</div>
                        <div className="font-semibold">
                          {new Date(teamDetails.session.started_at).toLocaleTimeString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                        <div className="font-semibold capitalize">{teamDetails.session.status}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Agents</div>
                        <div className="font-semibold">{teamDetails.agents.length}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Left Column */}
                  <div className="lg:col-span-1 space-y-4">
                    <AgentList agents={teamDetails.agents} />
                  </div>

                  {/* Right Column */}
                  <div className="lg:col-span-2 space-y-4">
                    <KanbanBoard tasks={teamDetails.tasks} />
                    <LiveActivity
                      events={teamDetails.events}
                      messages={teamDetails.messages}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h2 className="text-2xl font-semibold mb-2">No Active Teams</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create an agent team in Claude Code to start monitoring
                </p>
                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4 text-left max-w-md mx-auto">
                  <code className="text-sm">
                    Create an agent team to build a web dashboard
                  </code>
                </div>
              </div>
            )}
          </>
        ) : (
          <HistoryView />
        )}
      </div>
    </main>
  );
}

function HistoryView() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3847';
      const response = await fetch(`${API_URL}/api/history`);
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center">
        <div className="text-gray-600 dark:text-gray-400">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b dark:border-slate-700">
        <h2 className="text-lg font-semibold">Session History</h2>
      </div>
      {sessions.length === 0 ? (
        <div className="p-12 text-center text-gray-600 dark:text-gray-400">
          No completed sessions yet
        </div>
      ) : (
        <div className="divide-y dark:divide-slate-700">
          {sessions.map((session) => (
            <div key={session.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{session.team_name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(session.started_at).toLocaleString()}
                    {session.ended_at && ` - ${new Date(session.ended_at).toLocaleString()}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {session.agents?.length || 0} agents • {session.tasks?.length || 0} tasks
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {session.messageCount || 0} messages
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
