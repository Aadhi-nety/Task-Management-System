// backend/src/repositories/ProjectRepository.js
import { BaseRepository } from './BaseRepository.js';
import Project from '../models/Project.js';

export class ProjectRepository extends BaseRepository {
  constructor() {
    super(Project);
  }

  async findByUser(userId) {
    try {
      return await this.model.find({ createdBy: userId }).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error finding projects by user: ${error.message}`);
    }
  }

  async findByIdWithTasks(id) {
    try {
      return await this.model.findById(id).populate({
        path: 'tasks',
        options: { sort: { createdAt: -1 } }
      });
    } catch (error) {
      throw new Error(`Error finding project with tasks: ${error.message}`);
    }
  }
}