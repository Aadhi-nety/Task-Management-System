import { create } from 'zustand';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  projectId: string;
  createdBy: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  setTasks: (tasks: Task[]) => void;
  setCurrentTask: (task: Task | null) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  currentTask: null,
  setTasks: (tasks) => set({ tasks }),
  setCurrentTask: (task) => set({ currentTask: task }),
  addTask: (task) => set((state) => ({ 
    tasks: [task, ...state.tasks] 
  })),
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map(task =>
      task._id === taskId ? { ...task, ...updates } : task
    )
  })),
  removeTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter(task => task._id !== taskId)
  })),
  moveTask: (taskId, newStatus) => set((state) => ({
    tasks: state.tasks.map(task =>
      task._id === taskId ? { ...task, status: newStatus } : task
    )
  })),
}));