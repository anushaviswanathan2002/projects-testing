import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { authMiddleware } from '../middleware/auth.middleware.js';
import * as teamService from '../services/team.service.js';

const router = Router();

const createTeamSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
});

const updateTeamSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
});

const createProjectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i),
});

// Create team
router.post('/teams', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { error, value } = createTeamSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const team = await teamService.createTeam(value.name, req.userId!, value.description);

    res.status(201).json({
      success: true,
      data: team,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// Get user teams
router.get('/teams', authMiddleware, async (req: Request, res: Response) => {
  try {
    const teams = await teamService.getUserTeams(req.userId!);

    res.json({
      success: true,
      data: teams,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Get team
router.get('/teams/:teamId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;

    const team = await teamService.getTeam(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const members = await teamService.getTeamMembers(teamId);
    const projects = await teamService.getTeamProjects(teamId);

    res.json({
      success: true,
      data: { team, members, projects },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// Update team
router.patch('/teams/:teamId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const { error, value } = updateTeamSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const team = await teamService.updateTeam(teamId, value);

    res.json({
      success: true,
      data: team,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team' });
  }
});

// Add team member
router.post('/teams/:teamId/members', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const { userId, role } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const member = await teamService.addTeamMember(teamId, userId, role || 'member');

    res.status(201).json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add team member' });
  }
});

// Get team members
router.get('/teams/:teamId/members', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;

    const members = await teamService.getTeamMembers(teamId);

    res.json({
      success: true,
      data: members,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Remove team member
router.delete('/teams/:teamId/members/:userId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { teamId, userId } = req.params;

    await teamService.removeTeamMember(teamId, userId);

    res.json({
      success: true,
      message: 'Member removed',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

// Update member role
router.patch('/teams/:teamId/members/:userId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { teamId, userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    const member = await teamService.updateTeamMemberRole(teamId, userId, role);

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update member role' });
  }
});

// Create project
router.post('/teams/:teamId/projects', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const { error, value } = createProjectSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const project = await teamService.createProject(
      teamId,
      value.name,
      req.userId!,
      value.description,
      value.color
    );

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get team projects
router.get('/teams/:teamId/projects', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;

    const projects = await teamService.getTeamProjects(teamId);

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get project
router.get('/projects/:projectId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = await teamService.getProject(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Update project
router.patch('/projects/:projectId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { error, value } = createProjectSchema.validate(req.body, { allowUnknown: true });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const project = await teamService.updateProject(projectId, value);

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/projects/:projectId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    await teamService.deleteProject(projectId);

    res.json({
      success: true,
      message: 'Project deleted',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
