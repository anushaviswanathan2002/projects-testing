import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Loader } from 'lucide-react';
import { useTasksStore, Task } from '../store/tasks';
import { TaskCard } from '../components/TaskCard';
import * as taskApi from '../api/tasks';
import * as teamApi from '../api/teams';

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<any>(null);
  const tasks = useTasksStore((state) => state.tasks);
  const setTasks = useTasksStore((state) => state.setTasks);
  const updateTask = useTasksStore((state) => state.updateTask);
  const removeTask = useTasksStore((state) => state.removeTask);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    if (projectId) loadData();
  }, [projectId]);

  async function loadData() {
    try {
      const [projectData, tasksData] = await Promise.all([
        teamApi.getProject(projectId!),
        taskApi.getProjectTasks(projectId!),
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId || !newTaskTitle) return;

    try {
      const newTask = await taskApi.createTask(projectId, newTaskTitle);
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  const filteredTasks = filter
    ? tasks.filter((t) => t.status === filter || t.priority === filter)
    : tasks;

  const statusOptions = ['todo', 'in_progress', 'in_review', 'done'];
  const priorityOptions = ['low', 'medium', 'high', 'urgent'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {project && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            {project.description && (
              <p className="text-gray-600 mt-2">{project.description}</p>
            )}
          </div>

          <form onSubmit={handleCreateTask} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Create a new task..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
              >
                <Plus size={18} />
                Add Task
              </button>
            </div>
          </form>

          <div className="mb-6 flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filter === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Tasks
            </button>
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600">No tasks yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={removeTask} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
