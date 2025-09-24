export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
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

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: PaginationInfo;
}

export interface DashboardStats {
  statusCounts: Array<{ _id: string; count: number }>;
  overdueCount: number;
}