export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const sortTasksByPriority = (tasks: any[]) => {
  const priorityOrder: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
  return tasks.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
};

export const sortTasksByDeadline = (tasks: any[]) => {
  return tasks.sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });
};

export const filterTasksByStatus = (tasks: any[], status: string) => {
  return tasks.filter(task => task.status === status);
};

export const filterTasksByPriority = (tasks: any[], priority: string) => {
  return tasks.filter(task => task.priority === priority);
};

export const getTaskCountByStatus = (tasks: any[]) => {
  return tasks.reduce((acc: { [key: string]: number }, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});
};

export const getOverdueTasks = (tasks: any[]) => {
  const now = new Date();
  return tasks.filter(task => 
    task.deadline && new Date(task.deadline) < now && task.status !== 'done'
  );
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatStatus = (status: string): string => {
  return status.split('-').map(capitalizeFirstLetter).join(' ');
};

export const formatPriority = (priority: string): string => {
  return capitalizeFirstLetter(priority);
};