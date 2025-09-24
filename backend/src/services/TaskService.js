// backend/src/services/TaskService.js
import { TaskRepository } from '../repositories/TaskRepository.js';

export class TaskService {
  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async createTask(taskData) {
    try {
      return await this.taskRepository.create(taskData);
    } catch (error) {
      throw new Error(`Error creating task: ${error.message}`);
    }
  }

  async getProjectTasks(projectId, filters, pagination) {
    try {
      return await this.taskRepository.findByProject(projectId, filters, pagination);
    } catch (error) {
      throw new Error(`Error fetching project tasks: ${error.message}`);
    }
  }

  async updateTask(taskId, updateData, userId) {
    try {
      const task = await this.taskRepository.findById(taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }

      // Verify user owns the task's project
      if (task.createdBy.toString() !== userId) {
        throw new Error('Not authorized to update this task');
      }

      return await this.taskRepository.update(taskId, updateData);
    } catch (error) {
      throw new Error(`Error updating task: ${error.message}`);
    }
  }

  async updateTaskStatus(taskId, status, userId) {
    try {
      const task = await this.taskRepository.findById(taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }

      if (task.createdBy.toString() !== userId) {
        throw new Error('Not authorized to update this task');
      }

      return await this.taskRepository.updateStatus(taskId, status);
    } catch (error) {
      throw new Error(`Error updating task status: ${error.message}`);
    }
  }

  async deleteTask(taskId, userId) {
    try {
      const task = await this.taskRepository.findById(taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }

      if (task.createdBy.toString() !== userId) {
        throw new Error('Not authorized to delete this task');
      }

      return await this.taskRepository.delete(taskId);
    } catch (error) {
      throw new Error(`Error deleting task: ${error.message}`);
    }
  }

  async getDashboardStats(userId) {
    try {
      return await this.taskRepository.getDashboardStats(userId);
    } catch (error) {
      throw new Error(`Error getting dashboard stats: ${error.message}`);
    }
  }
}