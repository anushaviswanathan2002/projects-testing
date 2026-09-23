import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { authMiddleware } from '../middleware/auth.middleware.js';
import * as taskService from '../services/task.service.js';
import * as teamService from '../services/team.service.js';

const router = Router();

const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  status: Joi.string().valid('backlog', 'todo', 'in_progress', 'in_review', 'done', 'archived'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  dueDate: Joi.date(),
  assignedTo: Joi.string().uuid(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  status: Joi.string().valid('backlog', 'todo', 'in_progress', 'in_review', 'done', 'archived'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  dueDate: Joi.date(),
  assignedTo: Joi.string().uuid(),
});

// Get project tasks
router.get('/projects/:projectId/tasks', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { status, priority, assignedTo } = req.query;

    const project = await teamService.getProject(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const tasks = await taskService.getProjectTasks(projectId, {
      status: status as string,
      priority: priority as string,
      assignedTo: assignedTo as string,
    });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create task
router.post('/projects/:projectId/tasks', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { error, value } = createTaskSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const project = await teamService.getProject(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const task = await taskService.createTask(projectId, value.title, req.userId!, {
      description: value.description,
      status: value.status,
      priority: value.priority,
      dueDate: value.dueDate,
      assignedTo: value.assignedTo,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Get task
router.get('/tasks/:taskId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const task = await taskService.getTask(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const comments = await taskService.getTaskComments(taskId);
    const activity = await taskService.getTaskActivity(taskId);

    res.json({
      success: true,
      data: { task, comments, activity },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Update task
router.patch('/tasks/:taskId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { error, value } = updateTaskSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const task = await taskService.getTask(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updated = await taskService.updateTask(taskId, req.userId!, value);

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/tasks/:taskId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const task = await taskService.getTask(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await taskService.deleteTask(taskId, req.userId!);

    res.json({
      success: true,
      message: 'Task deleted',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Complete task
router.post('/tasks/:taskId/complete', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const task = await taskService.getTask(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const completed = await taskService.completeTask(taskId, req.userId!);

    res.json({
      success: true,
      data: completed,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

// Add comment
router.post('/tasks/:taskId/comments', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const task = await taskService.getTask(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const comment = await taskService.addComment(taskId, req.userId!, content);

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Search tasks
router.get('/projects/:projectId/search', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const project = await teamService.getProject(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const tasks = await taskService.searchTasks(projectId, q as string);

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
