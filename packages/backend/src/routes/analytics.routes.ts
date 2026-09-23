import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import * as analyticsService from '../services/analytics.service.js';
import * as teamService from '../services/team.service.js';

const router = Router();

// Get project analytics
router.get('/projects/:projectId/analytics', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = await teamService.getProject(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const analytics = await analyticsService.getProjectAnalytics(projectId);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get team analytics
router.get('/teams/:teamId/analytics', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;

    const team = await teamService.getTeam(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const analytics = await analyticsService.getTeamAnalytics(teamId);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team analytics' });
  }
});

// Get user stats
router.get('/users/:userId/stats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const stats = await analyticsService.getUserStats(userId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

export default router;
