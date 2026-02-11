'use client';

interface Task {
  task_id?: string;
  id?: string;
  subject?: string;
  description?: string;
  status?: string;
  owner?: string;
}

interface KanbanBoardProps {
  tasks: Task[];
}

export default function KanbanBoard({ tasks }: KanbanBoardProps) {
  const pending = tasks.filter(t => t.status === 'pending');
  const inProgress = tasks.filter(t => t.status === 'in_progress');
  const completed = tasks.filter(t => t.status === 'completed');

  const TaskCard = ({ task }: { task: Task }) => (
    <div className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow-sm mb-2 border border-gray-200 dark:border-slate-600">
      <div className="font-medium text-sm mb-1">{task.subject || 'Untitled Task'}</div>
      {task.description && (
        <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
          {task.description}
        </div>
      )}
      {task.owner && (
        <div className="text-xs text-claude-purple font-medium">
          👤 {task.owner}
        </div>
      )}
    </div>
  );

  const Column = ({ title, tasks, color }: { title: string; tasks: Task[]; color: string }) => (
    <div className="flex-1 min-w-[250px]">
      <div className={`font-semibold mb-3 pb-2 border-b-2 ${color}`}>
        {title} ({tasks.length})
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.task_id || task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">
            No tasks
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Task Board</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        <Column title="Pending" tasks={pending} color="border-yellow-400" />
        <Column title="In Progress" tasks={inProgress} color="border-blue-400" />
        <Column title="Completed" tasks={completed} color="border-green-400" />
      </div>
    </div>
  );
}
