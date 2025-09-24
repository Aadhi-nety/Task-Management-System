import React from 'react';
import { useDrag } from 'react-dnd';
import { formatDate } from '../../lib/utils';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task._id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const borderColors = {
    low: 'border-green-500',
    medium: 'border-yellow-500',
    high: 'border-red-500'
  };

  return (
    <div
      ref={drag}
      className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
        borderColors[task.priority]
      } cursor-move transition-opacity ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      onClick={() => onEdit(task)}
    >
      <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      <div className="flex justify-between items-center text-xs">
        <span className={`px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        {task.deadline && (
          <span className="text-gray-500">{formatDate(task.deadline)}</span>
        )}
      </div>
    </div>
  );
};