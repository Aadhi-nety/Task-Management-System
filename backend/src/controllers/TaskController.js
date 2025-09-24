// backend/src/controllers/TaskController.js
import { TaskService } from '../services/TaskService.js';

export class TaskController {
  constructor() {
    this.taskService = new TaskService();
  }

  createTask = async (req, res) => {
    try {
      const taskData = {
        ...req.body,
        createdBy: req.user.userId
      };
      
      const task = await this.taskService.createTask(taskData);
      res.status(201).json({
        success: true,
        data: task
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  getProjectTasks = async (req, res) => {
    try {
      const { projectId } = req.params;
      const filters = req.query;
      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      };

      const result = await this.taskService.getProjectTasks(projectId, filters, pagination);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  updateTask = async (req, res) => {
    try {
      const task = await this.taskService.updateTask(req.params.id, req.body, req.user.userId);
      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  updateTaskStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const task = await this.taskService.updateTaskStatus(req.params.id, status, req.user.userId);
      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  deleteTask = async (req, res) => {
    try {
      await this.taskService.deleteTask(req.params.id, req.user.userId);
      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  getDashboardStats = async (req, res) => {
    try {
      const stats = await this.taskService.getDashboardStats(req.user.userId);
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}