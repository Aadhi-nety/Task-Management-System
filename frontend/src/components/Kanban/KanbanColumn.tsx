import React from 'react';
import { useDrop } from 'react-dnd';
import { TaskCard } from './TaskCard';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
}

interface KanbanColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task['status']) => void;
  onEditTask: (task: Task) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  title, 
  status, 
  tasks, 
  onTaskMove, 
  onEditTask 
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string; status: Task['status'] }) => {
      if (item.status !== status) {
        onTaskMove(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`bg-gray-100 rounded-lg p-4 min-h-[500px] ${
        isOver ? 'bg-blue-100' : ''
      }`}
    >
      <h3 className="font-semibold text-gray-700 mb-4">{title} ({tasks.length})</h3>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  );
};