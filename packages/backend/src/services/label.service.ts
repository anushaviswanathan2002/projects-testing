import { v4 as uuidv4 } from 'uuid';
import { query } from '../database/connection.js';

export async function createLabel(projectId: string, name: string, color?: string) {
  const id = uuidv4();
  const result = await query(
    `INSERT INTO task_labels (id, project_id, name, color) VALUES ($1, $2, $3, $4)
     RETURNING id, project_id, name, color, created_at`,
    [id, projectId, name, color || '#999999']
  );
  return result.rows[0];
}

export async function getProjectLabels(projectId: string) {
  const result = await query(
    `SELECT id, project_id, name, color, created_at FROM task_labels WHERE project_id = $1`,
    [projectId]
  );
  return result.rows;
}

export async function deleteLabel(labelId: string) {
  await query('DELETE FROM task_labels WHERE id = $1', [labelId]);
}

export async function addLabelToTask(taskId: string, labelId: string) {
  await query(
    `INSERT INTO task_label_assignments (task_id, label_id) VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [taskId, labelId]
  );
}

export async function removeLabelFromTask(taskId: string, labelId: string) {
  await query('DELETE FROM task_label_assignments WHERE task_id = $1 AND label_id = $2', [
    taskId,
    labelId,
  ]);
}

export async function getTaskLabels(taskId: string) {
  const result = await query(
    `SELECT tl.id, tl.project_id, tl.name, tl.color, tl.created_at
     FROM task_labels tl
     JOIN task_label_assignments tla ON tl.id = tla.label_id
     WHERE tla.task_id = $1`,
    [taskId]
  );
  return result.rows;
}
