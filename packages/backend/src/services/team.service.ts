import { v4 as uuidv4 } from 'uuid';
import { query } from '../database/connection.js';
import { Team, TeamMember, Project } from '../types/index.js';

export async function createTeam(name: string, ownerId: string, description?: string): Promise<Team> {
  const id = uuidv4();

  const result = await query(
    `INSERT INTO teams (id, name, description, owner_id) VALUES ($1, $2, $3, $4)
     RETURNING id, name, description, owner_id, avatar_url, created_at, updated_at`,
    [id, name, description, ownerId]
  );

  const team = result.rows[0];

  // Add owner as team member
  await addTeamMember(team.id, ownerId, 'owner');

  // Create default project
  await createDefaultProject(team.id, ownerId);

  return team;
}

export async function getTeam(teamId: string): Promise<Team | null> {
  const result = await query(
    'SELECT id, name, description, owner_id, avatar_url, created_at, updated_at FROM teams WHERE id = $1',
    [teamId]
  );
  return result.rows[0] || null;
}

export async function getUserTeams(userId: string): Promise<Team[]> {
  const result = await query(
    `SELECT DISTINCT t.id, t.name, t.description, t.owner_id, t.avatar_url, t.created_at, t.updated_at
     FROM teams t
     JOIN team_members tm ON t.id = tm.team_id
     WHERE tm.user_id = $1
     ORDER BY t.created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function updateTeam(teamId: string, updates: Partial<Team>): Promise<Team> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  const validFields = ['name', 'description', 'avatar_url'];

  for (const [key, value] of Object.entries(updates)) {
    if (validFields.includes(key)) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  }

  if (fields.length === 0) return getTeam(teamId) as Promise<Team>;

  values.push(teamId);
  fields.push('updated_at = NOW()');

  const result = await query(
    `UPDATE teams SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, name, description, owner_id, avatar_url, created_at, updated_at`,
    values
  );

  return result.rows[0];
}

export async function addTeamMember(teamId: string, userId: string, role: 'owner' | 'admin' | 'member' = 'member'): Promise<TeamMember> {
  const id = uuidv4();
  const result = await query(
    `INSERT INTO team_members (id, team_id, user_id, role) VALUES ($1, $2, $3, $4)
     ON CONFLICT (team_id, user_id) DO UPDATE SET role = $4
     RETURNING id, team_id, user_id, role, joined_at`,
    [id, teamId, userId, role]
  );
  return result.rows[0];
}

export async function getTeamMembers(teamId: string): Promise<(TeamMember & { email: string; username: string; avatar_url?: string })[]> {
  const result = await query(
    `SELECT tm.id, tm.team_id, tm.user_id, tm.role, tm.joined_at, u.email, u.username, u.avatar_url
     FROM team_members tm
     JOIN users u ON tm.user_id = u.id
     WHERE tm.team_id = $1
     ORDER BY tm.joined_at DESC`,
    [teamId]
  );
  return result.rows;
}

export async function removeTeamMember(teamId: string, userId: string): Promise<void> {
  await query('DELETE FROM team_members WHERE team_id = $1 AND user_id = $2', [teamId, userId]);
}

export async function updateTeamMemberRole(teamId: string, userId: string, role: 'owner' | 'admin' | 'member'): Promise<TeamMember> {
  const result = await query(
    `UPDATE team_members SET role = $1 WHERE team_id = $2 AND user_id = $3
     RETURNING id, team_id, user_id, role, joined_at`,
    [role, teamId, userId]
  );
  return result.rows[0];
}

export async function createProject(teamId: string, name: string, ownerId: string, description?: string, color?: string): Promise<Project> {
  const id = uuidv4();
  const result = await query(
    `INSERT INTO projects (id, team_id, name, description, owner_id, color, is_default)
     VALUES ($1, $2, $3, $4, $5, $6, false)
     RETURNING id, team_id, name, description, color, owner_id, is_default, created_at, updated_at`,
    [id, teamId, name, description, ownerId, color || '#3b82f6']
  );
  return result.rows[0];
}

async function createDefaultProject(teamId: string, ownerId: string): Promise<Project> {
  const id = uuidv4();
  const result = await query(
    `INSERT INTO projects (id, team_id, name, owner_id, is_default)
     VALUES ($1, $2, $3, $4, true)
     RETURNING id, team_id, name, description, color, owner_id, is_default, created_at, updated_at`,
    [id, teamId, 'General', ownerId]
  );
  return result.rows[0];
}

export async function getTeamProjects(teamId: string): Promise<Project[]> {
  const result = await query(
    `SELECT id, team_id, name, description, color, owner_id, is_default, created_at, updated_at
     FROM projects WHERE team_id = $1 ORDER BY created_at DESC`,
    [teamId]
  );
  return result.rows;
}

export async function getProject(projectId: string): Promise<Project | null> {
  const result = await query(
    `SELECT id, team_id, name, description, color, owner_id, is_default, created_at, updated_at
     FROM projects WHERE id = $1`,
    [projectId]
  );
  return result.rows[0] || null;
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  const validFields = ['name', 'description', 'color'];

  for (const [key, value] of Object.entries(updates)) {
    if (validFields.includes(key)) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  }

  if (fields.length === 0) return getProject(projectId) as Promise<Project>;

  values.push(projectId);
  fields.push('updated_at = NOW()');

  const result = await query(
    `UPDATE projects SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, team_id, name, description, color, owner_id, is_default, created_at, updated_at`,
    values
  );

  return result.rows[0];
}

export async function deleteProject(projectId: string): Promise<void> {
  await query('DELETE FROM projects WHERE id = $1', [projectId]);
}
