import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Loader } from 'lucide-react';
import * as teamApi from '../api/teams';

interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
}

export function TeamPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);

  useEffect(() => {
    if (teamId) loadTeam();
  }, [teamId]);

  async function loadTeam() {
    try {
      const data = await teamApi.getTeam(teamId!);
      setTeam(data.team);
      setProjects(data.projects);
    } catch (error) {
      console.error('Failed to load team:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!teamId || !newProjectName) return;

    try {
      const newProject = await teamApi.createProject(teamId, newProjectName);
      setProjects([...projects, newProject]);
      setNewProjectName('');
      setShowNewProject(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {team && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{team.name}</h1>
            {team.description && (
              <p className="text-gray-600">{team.description}</p>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Projects</h2>
              <button
                onClick={() => setShowNewProject(!showNewProject)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={18} />
                New Project
              </button>
            </div>

            {showNewProject && (
              <form onSubmit={handleCreateProject} className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Project name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-3"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewProject(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {projects.length === 0 ? (
              <p className="text-gray-600">No projects yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
                    style={{ borderLeft: `4px solid ${project.color}` }}
                  >
                    <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                    {project.description && (
                      <p className="text-gray-600 text-sm mt-2">{project.description}</p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
