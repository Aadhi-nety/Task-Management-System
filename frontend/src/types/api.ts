// Remove the import that causes conflicts and define types directly
export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type CreateProjectRequest = {
  name: string;
  description?: string;
};

export type CreateTaskRequest = {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  projectId: string;
  status?: 'todo' | 'in-progress' | 'done';
};

export type UpdateTaskRequest = Partial<CreateTaskRequest>;

export type TaskFilters = {
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};