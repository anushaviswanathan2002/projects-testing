import client from './client';

export async function createTeam(name: string, description?: string) {
  const response = await client.post('/teams', { name, description });
  return response.data.data;
}

export async function getUserTeams() {
  const response = await client.get('/teams');
  return response.data.data;
}

export async function getTeam(teamId: string) {
  const response = await client.get(`/teams/${teamId}`);
  return response.data.data;
}

export async function updateTeam(teamId: string, updates: any) {
  const response = await client.patch(`/teams/${teamId}`, updates);
  return response.data.data;
}

export async function getTeamMembers(teamId: string) {
  const response = await client.get(`/teams/${teamId}/members`);
  return response.data.data;
}

export async function addTeamMember(teamId: string, userId: string, role: string) {
  const response = await client.post(`/teams/${teamId}/members`, { userId, role });
  return response.data.data;
}

export async function removeTeamMember(teamId: string, userId: string) {
  return await client.delete(`/teams/${teamId}/members/${userId}`);
}

export async function createProject(teamId: string, name: string, description?: string, color?: string) {
  const response = await client.post(`/teams/${teamId}/projects`, { name, description, color });
  return response.data.data;
}

export async function getTeamProjects(teamId: string) {
  const response = await client.get(`/teams/${teamId}/projects`);
  return response.data.data;
}

export async function updateProject(projectId: string, updates: any) {
  const response = await client.patch(`/projects/${projectId}`, updates);
  return response.data.data;
}

export async function deleteProject(projectId: string) {
  return await client.delete(`/projects/${projectId}`);
}
