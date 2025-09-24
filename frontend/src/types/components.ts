import { Task, Project } from './index';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export interface KanbanColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task['status']) => void;
  onEditTask: (task: Task) => void;
}

export interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task['status']) => void;
  onEditTask: (task: Task) => void;
}

export interface TaskFormProps {
  onSubmit: (data: any) => void;
  initialData?: Partial<Task>;
  isLoading?: boolean;
}

export interface ProjectFormProps {
  onSubmit: (data: any) => void;
  initialData?: Partial<Project>;
  isLoading?: boolean;
}