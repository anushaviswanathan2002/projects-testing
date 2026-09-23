import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import * as labelService from '../services/label.service.js';
import * as teamService from '../services/team.service.js';

const router = Router();

// Create label
router.post('/projects/:projectId/labels', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Label name is required' });
    }

    const project = await teamService.getProject(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const label = await labelService.createLabel(projectId, name, color);

    res.status(201).json({
      success: true,
      data: label,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create label' });
  }
});

// Get project labels
router.get('/projects/:projectId/labels', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = await teamService.getProject(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const labels = await labelService.getProjectLabels(projectId);

    res.json({
      success: true,
      data: labels,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch labels' });
  }
});

// Delete label
router.delete('/labels/:labelId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { labelId } = req.params;

    await labelService.deleteLabel(labelId);

    res.json({
      success: true,
      message: 'Label deleted',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete label' });
  }
});

// Add label to task
router.post('/tasks/:taskId/labels/:labelId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { taskId, labelId } = req.params;

    await labelService.addLabelToTask(taskId, labelId);

    res.status(201).json({
      success: true,
      message: 'Label added to task',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add label' });
  }
});

// Remove label from task
router.delete('/tasks/:taskId/labels/:labelId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { taskId, labelId } = req.params;

    await labelService.removeLabelFromTask(taskId, labelId);

    res.json({
      success: true,
      message: 'Label removed from task',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove label' });
  }
});

// Get task labels
router.get('/tasks/:taskId/labels', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const labels = await labelService.getTaskLabels(taskId);

    res.json({
      success: true,
      data: labels,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch labels' });
  }
});

export default router;
