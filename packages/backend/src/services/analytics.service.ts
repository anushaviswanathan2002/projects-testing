import { query } from '../database/connection.js';

export async function getProjectAnalytics(projectId: string) {
  try {
    // Total tasks by status
    const statusResult = await query(
      `SELECT status, COUNT(*) as count FROM tasks WHERE project_id = $1 GROUP BY status`,
      [projectId]
    );

    // Total tasks by priority
    const priorityResult = await query(
      `SELECT priority, COUNT(*) as count FROM tasks WHERE project_id = $1 GROUP BY priority`,
      [projectId]
    );

    // Completion rate
    const completionResult = await query(
      `SELECT
        COUNT(CASE WHEN status = 'done' THEN 1 END) as completed,
        COUNT(*) as total
      FROM tasks WHERE project_id = $1`,
      [projectId]
    );

    // Overdue tasks
    const overdueResult = await query(
      `SELECT COUNT(*) as count FROM tasks 
      WHERE project_id = $1 
      AND due_date < NOW() 
      AND status != 'done'`,
      [projectId]
    );

    // Tasks due this week
    const dueThisWeekResult = await query(
      `SELECT COUNT(*) as count FROM tasks 
      WHERE project_id = $1 
      AND due_date >= NOW() 
      AND due_date <= NOW() + INTERVAL '7 days'
      AND status != 'done'`,
      [projectId]
    );

    // Assignment distribution
    const assignmentResult = await query(
      `SELECT assigned_to, COUNT(*) as count FROM tasks 
      WHERE project_id = $1 
      GROUP BY assigned_to`,
      [projectId]
    );

    const { completed, total } = completionResult.rows[0];
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      summary: {
        totalTasks: total,
        completedTasks: completed,
        completionRate,
        overdueCount: overdueResult.rows[0].count,
        dueThisWeekCount: dueThisWeekResult.rows[0].count,
      },
      byStatus: statusResult.rows,
      byPriority: priorityResult.rows,
      assignmentDistribution: assignmentResult.rows,
    };
  } catch (error) {
    console.error('Analytics error:', error);
    throw error;
  }
}

export async function getTeamAnalytics(teamId: string) {
  try {
    // Total tasks
    const taskCountResult = await query(
      `SELECT COUNT(*) as count FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE p.team_id = $1`,
      [teamId]
    );

    // Active team members
    const memberCountResult = await query(
      `SELECT COUNT(*) as count FROM team_members WHERE team_id = $1`,
      [teamId]
    );

    // Tasks by user
    const userTaskResult = await query(
      `SELECT u.username, COUNT(t.id) as task_count
      FROM users u
      LEFT JOIN task_activities ta ON u.id = ta.user_id
      LEFT JOIN tasks t ON ta.task_id = t.id
      WHERE t.id IN (
        SELECT t.id FROM tasks t
        JOIN projects p ON t.project_id = p.id
        WHERE p.team_id = $1
      )
      GROUP BY u.id, u.username`,
      [teamId]
    );

    return {
      totalTasks: taskCountResult.rows[0].count,
      totalMembers: memberCountResult.rows[0].count,
      userActivity: userTaskResult.rows,
    };
  } catch (error) {
    console.error('Team analytics error:', error);
    throw error;
  }
}

export async function getUserStats(userId: string) {
  try {
    // Tasks assigned to user
    const assignedResult = await query(
      `SELECT COUNT(*) as count FROM tasks WHERE assigned_to = $1 AND status != 'done'`,
      [userId]
    );

    // Completed tasks
    const completedResult = await query(
      `SELECT COUNT(*) as count FROM tasks WHERE assigned_to = $1 AND status = 'done'`,
      [userId]
    );

    // Overdue tasks
    const overdueResult = await query(
      `SELECT COUNT(*) as count FROM tasks 
      WHERE assigned_to = $1 
      AND status != 'done' 
      AND due_date < NOW()`,
      [userId]
    );

    return {
      assignedCount: assignedResult.rows[0].count,
      completedCount: completedResult.rows[0].count,
      overdueCount: overdueResult.rows[0].count,
    };
  } catch (error) {
    console.error('User stats error:', error);
    throw error;
  }
}
