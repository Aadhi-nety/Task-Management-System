import { useState, useEffect } from 'react';
import { projectAPI } from '@/lib/api';

// Define Project interface locally since import is failing
interface Project {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.list();
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: { name: string; description?: string }) => {
    try {
      const response = await projectAPI.create(projectData);
      if (response.data.success) {
        setProjects(prev => [response.data.data, ...prev]);
        return { success: true, project: response.data.data };
      }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to create project' 
      };
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await projectAPI.delete(projectId);
      setProjects(prev => prev.filter(project => project._id !== projectId));
      return { success: true };
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to delete project' 
      };
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
  };
};