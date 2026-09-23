import client from './client';
import { User } from '../store/auth';

export async function register(email: string, username: string, password: string) {
  const response = await client.post('/auth/register', { email, username, password });
  return response.data.data;
}

export async function login(email: string, password: string) {
  const response = await client.post('/auth/login', { email, password });
  return response.data.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await client.get('/auth/me');
  return response.data.data;
}

export async function logout() {
  await client.post('/auth/logout');
}
