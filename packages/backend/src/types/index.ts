export interface User {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: Date;
}

export interface Project {
  id: string;
  team_id: string;
  name: string;
  description?: string;
  color: string;
  owner_id: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: Date;
  assigned_to?: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface TaskActivity {
  id: string;
  task_id: string;
  user_id: string;
  action: string;
  changes?: Record<string, any>;
  created_at: Date;
}

export interface TaskLabel {
  id: string;
  project_id: string;
  name: string;
  color: string;
  created_at: Date;
}

export interface TaskLabelAssignment {
  task_id: string;
  label_id: string;
}

export interface RecurringTask {
  id: string;
  original_task_id: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_occurrence?: Date;
  ends_at?: Date;
  created_at: Date;
}

export interface TokenBlacklist {
  token: string;
  blacklisted_at: Date;
  expires_at: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
