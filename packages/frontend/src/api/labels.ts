import client from './client';

export async function createLabel(projectId: string, name: string, color?: string) {
  const response = await client.post(`/projects/${projectId}/labels`, { name, color });
  return response.data.data;
}

export async function getProjectLabels(projectId: string) {
  const response = await client.get(`/projects/${projectId}/labels`);
  return response.data.data;
}

export async function deleteLabel(labelId: string) {
  return await client.delete(`/labels/${labelId}`);
}

export async function addLabelToTask(taskId: string, labelId: string) {
  const response = await client.post(`/tasks/${taskId}/labels/${labelId}`);
  return response.data.data;
}

export async function removeLabelFromTask(taskId: string, labelId: string) {
  return await client.delete(`/tasks/${taskId}/labels/${labelId}`);
}

export async function getTaskLabels(taskId: string) {
  const response = await client.get(`/tasks/${taskId}/labels`);
  return response.data.data;
}
