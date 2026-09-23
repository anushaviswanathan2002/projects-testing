import { v4 as uuidv4 } from 'uuid';
import { query } from '../database/connection.js';
import { Task, TaskComment, TaskActivity } from '../types/index.js';

export async function createTask(
  projectId: string,
  title: string,
  createdBy: string,
  data?: {
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: Date;
    assignedTo?: string;
  }
): Promise<Task> {
  const id = uuidv4();
  const result = await query(
    `INSERT INTO tasks (id, project_id, title, description, status, priority, due_date, assigned_to, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, project_id, title, description, status, priority, due_date, assigned_to, created_by, created_at, updated_at, completed_at`,
    [
      id,
      projectId,
      title,
      data?.description,
      data?.status || 'todo',
      data?.priority || 'medium',
      data?.dueDate,
      data?.assignedTo,
      createdBy,
    ]
  );

  await recordActivity(id, createdBy, 'created');

  return result.rows[0];
}

export async function getTask(taskId: string): Promise<Task | null> {
  const result = await query(
    `SELECT id, project_id, title, description, status, priority, due_date, assigned_to, created_by, created_at, updated_at, completed_at
     FROM tasks WHERE id = $1`,
    [taskId]
  );
  return result.rows[0] || null;
}

export async function getProjectTasks(projectId: string, filters?: { status?: string; priority?: string; assignedTo?: string }): Promise<Task[]> {
  let sql = 'SELECT id, project_id, title, description, status, priority, due_date, assigned_to, created_by, created_at, updated_at, completed_at FROM tasks WHERE project_id = $1';
  const params: any[] = [projectId];

  if (filters?.status) {
    sql += ` AND status = $${params.length + 1}`;
    params.push(filters.status);
  }
  if (filters?.priority) {
    sql += ` AND priority = $${params.length + 1}`;
    params.push(filters.priority);
  }
  if (filters?.assignedTo) {
    sql += ` AND assigned_to = $${params.length + 1}`;
    params.push(filters.assignedTo);
  }

  sql += ' ORDER BY created_at DESC';

  const result = await query(sql, params);
  return result.rows;
}

export async function updateTask(taskId: string, userId: string, updates: Partial<Task>): Promise<Task> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  const validFields = ['title', 'description', 'status', 'priority', 'due_date', 'assigned_to'];

  for (const [key, value] of Object.entries(updates)) {
    if (validFields.includes(key)) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  }

  if (fields.length === 0) return getTask(taskId) as Promise<Task>;

  values.push(taskId);
  fields.push('updated_at = NOW()');

  const result = await query(
    `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, project_id, title, description, status, priority, due_date, assigned_to, created_by, created_at, updated_at, completed_at`,
    values
  );

  await recordActivity(taskId, userId, 'updated', updates);

  return result.rows[0];
}

export async function deleteTask(taskId: string, userId: string): Promise<void> {
  await recordActivity(taskId, userId, 'deleted');
  await query('DELETE FROM tasks WHERE id = $1', [taskId]);
}

export async function completeTask(taskId: string, userId: string): Promise<Task> {
  const result = await query(
    `UPDATE tasks SET status = 'done', completed_at = NOW(), updated_at = NOW() WHERE id = $1 
     RETURNING id, project_id, title, description, status, priority, due_date, assigned_to, created_by, created_at, updated_at, completed_at`,
    [taskId]
  );

  await recordActivity(taskId, userId, 'completed');

  return result.rows[0];
}

export async function addComment(taskId: string, userId: string, content: string): Promise<TaskComment> {
  const id = uuidv4();
  const result = await query(
    `INSERT INTO task_comments (id, task_id, user_id, content) VALUES ($1, $2, $3, $4)
     RETURNING id, task_id, user_id, content, created_at, updated_at`,
    [id, taskId, userId, content]
  );

  await recordActivity(taskId, userId, 'commented');

  return result.rows[0];
}

export async function getTaskComments(taskId: string): Promise<TaskComment[]> {
  const result = await query(
    `SELECT tc.id, tc.task_id, tc.user_id, tc.content, tc.created_at, tc.updated_at, 
            u.username, u.avatar_url
     FROM task_comments tc
     LEFT JOIN users u ON tc.user_id = u.id
     WHERE tc.task_id = $1
     ORDER BY tc.created_at DESC`,
    [taskId]
  );
  return result.rows;
}

export async function recordActivity(taskId: string, userId: string, action: string, changes?: Record<string, any>): Promise<TaskActivity> {
  const id = uuidv4();
  const result = await query(
    `INSERT INTO task_activities (id, task_id, user_id, action, changes) 
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, task_id, user_id, action, changes, created_at`,
    [id, taskId, userId, action, JSON.stringify(changes)]
  );
  return result.rows[0];
}

export async function getTaskActivity(taskId: string): Promise<TaskActivity[]> {
  const result = await query(
    `SELECT ta.id, ta.task_id, ta.user_id, ta.action, ta.changes, ta.created_at, u.username, u.avatar_url
     FROM task_activities ta
     LEFT JOIN users u ON ta.user_id = u.id
     WHERE ta.task_id = $1
     ORDER BY ta.created_at DESC`,
    [taskId]
  );
  return result.rows;
}

export async function searchTasks(projectId: string, searchTerm: string): Promise<Task[]> {
  const result = await query(
    `SELECT id, project_id, title, description, status, priority, due_date, assigned_to, created_by, created_at, updated_at, completed_at
     FROM tasks 
     WHERE project_id = $1 AND (title ILIKE $2 OR description ILIKE $2)
     ORDER BY created_at DESC`,
    [projectId, `%${searchTerm}%`]
  );
  return result.rows;
}
