'use client';

import { useEffect, useRef } from 'react';

interface Event {
  id: number;
  event_type: string;
  event_data: string;
  timestamp: string;
}

interface Message {
  id: number;
  from_agent: string;
  to_agent: string;
  content: string;
  message_type: string;
  timestamp: string;
}

interface LiveActivityProps {
  events: Event[];
  messages: Message[];
}

export default function LiveActivity({ events, messages }: LiveActivityProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new activity arrives
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events, messages]);

  // Combine and sort events and messages by timestamp
  const combinedActivity = [
    ...events.map(e => ({ type: 'event', data: e, timestamp: e.timestamp })),
    ...messages.map(m => ({ type: 'message', data: m, timestamp: m.timestamp }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const renderActivity = (activity: any) => {
    if (activity.type === 'message') {
      const msg = activity.data as Message;
      return (
        <div key={`msg-${msg.id}`} className="border-l-4 border-blue-400 pl-3 py-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              💬 {msg.from_agent} → {msg.to_agent}
            </span>
          </div>
          <div className="text-sm">{msg.content}</div>
        </div>
      );
    } else {
      const evt = activity.data as Event;
      let eventData;
      try {
        eventData = JSON.parse(evt.event_data);
      } catch {
        eventData = evt.event_data;
      }

      return (
        <div key={`evt-${evt.id}`} className="border-l-4 border-gray-300 pl-3 py-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500">{formatTime(evt.timestamp)}</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              📋 {evt.event_type.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Live Activity</h2>
      <div
        ref={containerRef}
        className="space-y-3 max-h-[400px] overflow-y-auto bg-gray-50 dark:bg-slate-900 rounded p-3"
      >
        {combinedActivity.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-8">
            No activity yet. Waiting for events...
          </div>
        ) : (
          combinedActivity.map(renderActivity)
        )}
      </div>
    </div>
  );
}
