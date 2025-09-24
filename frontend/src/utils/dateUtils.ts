export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isToday = (date: string | Date): boolean => {
  const today = new Date();
  const compareDate = new Date(date);
  return (
    today.getFullYear() === compareDate.getFullYear() &&
    today.getMonth() === compareDate.getMonth() &&
    today.getDate() === compareDate.getDate()
  );
};

export const isTomorrow = (date: string | Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const compareDate = new Date(date);
  return (
    tomorrow.getFullYear() === compareDate.getFullYear() &&
    tomorrow.getMonth() === compareDate.getMonth() &&
    tomorrow.getDate() === compareDate.getDate()
  );
};

export const isOverdue = (date: string | Date): boolean => {
  return new Date(date) < new Date();
};

export const getDaysUntil = (date: string | Date): number => {
  const today = new Date();
  const targetDate = new Date(date);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getRelativeDate = (date: string | Date): string => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  
  const daysUntil = getDaysUntil(date);
  if (daysUntil < 0) return `${Math.abs(daysUntil)} days ago`;
  if (daysUntil === 1) return 'Tomorrow';
  if (daysUntil <= 7) return `In ${daysUntil} days`;
  
  return formatDate(date);
};

export const isValidDate = (date: string): boolean => {
  return !isNaN(new Date(date).getTime());
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};