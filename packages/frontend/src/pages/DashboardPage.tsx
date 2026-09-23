import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader } from 'lucide-react';
import * as teamApi from '../api/teams';

interface Team {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export function DashboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    try {
      const data = await teamApi.getUserTeams();
      setTeams(data);
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setLoading(false);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Teams</h1>
        <p className="text-gray-600">Manage your teams and projects</p>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No teams yet. Create one to get started!</p>
          <Link
            to="/teams/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Plus size={18} />
            Create First Team
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{team.name}</h3>
              {team.description && (
                <p className="text-gray-600 text-sm mb-4">{team.description}</p>
              )}
              <div className="text-xs text-gray-500">
                Created {new Date(team.created_at).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
