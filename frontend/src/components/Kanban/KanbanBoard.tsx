import React from 'react';
import { KanbanColumn } from './KanbanColumn';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task['status']) => void;
  onEditTask: (task: Task) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskMove, onEditTask }) => {
  const groupedTasks = {
    todo: tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    done: tasks.filter(task => task.status === 'done')
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KanbanColumn
        title="To Do"
        status="todo"
        tasks={groupedTasks.todo}
        onTaskMove={onTaskMove}
        onEditTask={onEditTask}
      />
      <KanbanColumn
        title="In Progress"
        status="in-progress"
        tasks={groupedTasks['in-progress']}
        onTaskMove={onTaskMove}
        onEditTask={onEditTask}
      />
      <KanbanColumn
        title="Done"
        status="done"
        tasks={groupedTasks.done}
        onTaskMove={onTaskMove}
        onEditTask={onEditTask}
      />
    </div>
  );
};