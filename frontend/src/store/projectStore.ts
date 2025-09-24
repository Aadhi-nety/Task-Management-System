import { create } from 'zustand';

export interface Project {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  removeProject: (projectId: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  addProject: (project) => set((state) => ({ 
    projects: [project, ...state.projects] 
  })),
  updateProject: (projectId, updates) => set((state) => ({
    projects: state.projects.map(project =>
      project._id === projectId ? { ...project, ...updates } : project
    )
  })),
  removeProject: (projectId) => set((state) => ({
    projects: state.projects.filter(project => project._id !== projectId)
  })),
}));