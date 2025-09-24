// backend/src/repositories/TaskRepository.js
import { BaseRepository } from './BaseRepository.js';
import Task from '../models/Task.js';

export class TaskRepository extends BaseRepository {
  constructor() {
    super(Task);
  }

  async findByProject(projectId, filters = {}, pagination = {}) {
    try {
      const { status, priority, startDate, endDate } = filters;
      const { page = 1, limit = 10 } = pagination;
      
      let query = { projectId };
      
      // Apply filters (YAGNI - only implement what's needed)
      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (startDate || endDate) {
        query.deadline = {};
        if (startDate) query.deadline.$gte = new Date(startDate);
        if (endDate) query.deadline.$lte = new Date(endDate);
      }

      const skip = (page - 1) * limit;
      
      const tasks = await this.model
        .find(query)
        .populate('createdBy', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      const total = await this.model.countDocuments(query);

      return {
        tasks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error finding tasks by project: ${error.message}`);
    }
  }

  async updateStatus(taskId, status) {
    try {
      return await this.model.findByIdAndUpdate(
        taskId, 
        { status }, 
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Error updating task status: ${error.message}`);
    }
  }

  async getDashboardStats(userId) {
    try {
      const stats = await this.model.aggregate([
        {
          $lookup: {
            from: 'projects',
            localField: 'projectId',
            foreignField: '_id',
            as: 'project'
          }
        },
        {
          $unwind: '$project'
        },
        {
          $match: {
            'project.createdBy': userId
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const overdueCount = await this.model.countDocuments({
        'project.createdBy': userId,
        deadline: { $lt: new Date() },
        status: { $ne: 'done' }
      });

      return { statusCounts: stats, overdueCount };
    } catch (error) {
      throw new Error(`Error getting dashboard stats: ${error.message}`);
    }
  }
}