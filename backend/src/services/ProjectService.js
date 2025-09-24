// backend/src/services/ProjectService.js
import { ProjectRepository } from '../repositories/ProjectRepository.js';

export class ProjectService {
  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async createProject(projectData) {
    try {
      return await this.projectRepository.create(projectData);
    } catch (error) {
      throw new Error(`Error creating project: ${error.message}`);
    }
  }

  async getUserProjects(userId) {
    try {
      return await this.projectRepository.findByUser(userId);
    } catch (error) {
      throw new Error(`Error fetching user projects: ${error.message}`);
    }
  }

  async deleteProject(projectId, userId) {
    try {
      const project = await this.projectRepository.findById(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }

      if (project.createdBy.toString() !== userId) {
        throw new Error('Not authorized to delete this project');
      }

      return await this.projectRepository.delete(projectId);
    } catch (error) {
      throw new Error(`Error deleting project: ${error.message}`);
    }
  }
}