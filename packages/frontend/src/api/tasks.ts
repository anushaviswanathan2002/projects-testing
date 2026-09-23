import client from './client';

export async function createTask(projectId: string, title: string, data?: any) {
  const response = await client.post(`/projects/${projectId}/tasks`, { title, ...data });
  return response.data.data;
}

export async function getProjectTasks(projectId: string, filters?: any) {
  const response = await client.get(`/projects/${projectId}/tasks`, { params: filters });
  return response.data.data;
}

export async function getTask(taskId: string) {
  const response = await client.get(`/tasks/${taskId}`);
  return response.data.data;
}

export async function updateTask(taskId: string, updates: any) {
  const response = await client.patch(`/tasks/${taskId}`, updates);
  return response.data.data;
}

export async function deleteTask(taskId: string) {
  return await client.delete(`/tasks/${taskId}`);
}

export async function completeTask(taskId: string) {
  const response = await client.post(`/tasks/${taskId}/complete`);
  return response.data.data;
}

export async function addComment(taskId: string, content: string) {
  const response = await client.post(`/tasks/${taskId}/comments`, { content });
  return response.data.data;
}

export async function getTaskComments(taskId: string) {
  const response = await client.get(`/tasks/${taskId}`);
  return response.data.data.comments;
}

export async function searchTasks(projectId: string, query: string) {
  const response = await client.get(`/projects/${projectId}/search`, { params: { q: query } });
  return response.data.data;
}
