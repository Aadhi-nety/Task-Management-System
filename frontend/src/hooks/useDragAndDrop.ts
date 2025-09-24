import { useDrag, useDrop } from 'react-dnd';

export const useTaskDrag = (taskId: string, taskStatus: string) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: taskId, status: taskStatus },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return {
    drag,
    isDragging,
  };
};

export const useTaskDrop = (
  status: string,
  onTaskMove: (taskId: string, newStatus: string) => void
) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string; status: string }) => {
      if (item.status !== status) {
        onTaskMove(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return {
    drop,
    isOver,
  };
};