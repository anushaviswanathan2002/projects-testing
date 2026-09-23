import React from 'react';
import { Task } from '../store/tasks';
import { format } from 'date-fns';
import { Trash2, CheckCircle2, Circle } from 'lucide-react';
import * as taskApi from '../api/tasks';

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const statusColors = {
  backlog: 'text-gray-500',
  todo: 'text-yellow-600',
  in_progress: 'text-blue-600',
  in_review: 'text-purple-600',
  done: 'text-green-600',
  archived: 'text-gray-400',
};

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  async function handleComplete() {
    try {
      const updated = await taskApi.completeTask(task.id);
      onUpdate(updated);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  }

  async function handleDelete() {
    if (window.confirm('Are you sure?')) {
      try {
        await taskApi.deleteTask(task.id);
        onDelete(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <button onClick={handleComplete} className="mt-1 flex-shrink-0">
          {task.status === 'done' ? (
            <CheckCircle2 size={20} className="text-green-600" />
          ) : (
            <Circle size={20} className="text-gray-400 hover:text-gray-600" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-gray-900 ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1 truncate">{task.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`text-xs px-2 py-1 rounded ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`text-xs px-2 py-1 bg-gray-100 rounded ${statusColors[task.status]}`}>
              {task.status.replace('_', ' ')}
            </span>
            {task.due_date && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                Due: {format(new Date(task.due_date), 'MMM d')}
              </span>
            )}
          </div>
        </div>

        <button onClick={handleDelete} className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
