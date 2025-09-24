import { useState, useEffect } from 'react';
import { taskAPI } from '@/lib/api';

// Define interfaces locally
interface User {
  id: string;
  username: string;
  email: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  projectId: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

interface TaskFilters {
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
}

export const useTasks = (projectId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (filters: TaskFilters = {}) => {
    if (!projectId) return;

    try {
      setLoading(true);
      const response = await taskAPI.byProject(projectId, filters);
      if (response.data.success) {
        setTasks(response.data.data.tasks);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const response = await taskAPI.create(taskData);
      if (response.data.success) {
        setTasks(prev => [response.data.data, ...prev]);
        return { success: true, task: response.data.data };
      }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to create task' 
      };
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await taskAPI.update(taskId, updates);
      if (response.data.success) {
        setTasks(prev => prev.map(task => 
          task._id === taskId ? { ...task, ...updates } : task
        ));
        return { success: true, task: response.data.data };
      }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to update task' 
      };
    }
  };

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      const response = await taskAPI.updateStatus(taskId, status);
      if (response.data.success) {
        setTasks(prev => prev.map(task => 
          task._id === taskId ? { ...task, status } : task
        ));
        return { success: true, task: response.data.data };
      }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to update task status' 
      };
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await taskAPI.delete(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      return { success: true };
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to delete task' 
      };
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  };
};