// backend/src/controllers/ProjectController.js
import { ProjectService } from '../services/ProjectService.js';

export class ProjectController {
  constructor() {
    this.projectService = new ProjectService();
  }

  createProject = async (req, res) => {
    try {
      const projectData = {
        ...req.body,
        createdBy: req.user.userId
      };
      
      const project = await this.projectService.createProject(projectData);
      res.status(201).json({
        success: true,
        data: project
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  getProjects = async (req, res) => {
    try {
      const projects = await this.projectService.getUserProjects(req.user.userId);
      res.json({
        success: true,
        data: projects
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  deleteProject = async (req, res) => {
    try {
      await this.projectService.deleteProject(req.params.id, req.user.userId);
      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}