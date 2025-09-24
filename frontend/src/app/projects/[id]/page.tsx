'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useForm } from 'react-hook-form';
import { taskAPI, projectAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
}

interface TaskForm {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
}

const TaskCard: React.FC<{ task: Task; onEdit: (task: Task) => void }> = ({ task, onEdit }) => {
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

  return (
    <div
      ref={drag as any}
      className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
        task.priority === 'high' ? 'border-red-500' :
        task.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
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

const Column: React.FC<{
  title: string;
  status: Task['status'];
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task['status']) => void;
  onEditTask: (task: Task) => void;
}> = ({ title, status, tasks, onTaskMove, onEditTask }) => {
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
      ref={drop as any}
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

function KanbanBoard() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskForm>();

  useEffect(() => {
    loadProjectAndTasks();
  }, [projectId]);

  const loadProjectAndTasks = async () => {
    try {
      const [projectResponse, tasksResponse] = await Promise.all([
        projectAPI.list().then((res: any) => res.data.data.find((p: any) => p._id === projectId)),
        taskAPI.byProject(projectId)
      ]);
      
      setProject(projectResponse);
      setTasks(tasksResponse.data.data.tasks);
    } catch (error) {
      console.error('Failed to load project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedTasks = {
    todo: tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    done: tasks.filter(task => task.status === 'done')
  };

  const handleTaskMove = async (taskId: string, newStatus: Task['status']) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      setTasks(prev => prev.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const onSubmit = async (data: TaskForm) => {
    try {
      const taskData = {
        ...data,
        projectId,
        status: 'todo' as const
      };

      if (editingTask) {
        await taskAPI.update(editingTask._id, taskData);
        setTasks(prev => prev.map(task =>
          task._id === editingTask._id ? { ...task, ...taskData } : task
        ));
      } else {
        const response = await taskAPI.create(taskData);
        setTasks(prev => [response.data.data, ...prev]);
      }

      setIsModalOpen(false);
      setEditingTask(null);
      reset();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskAPI.delete(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project?.name}</h1>
            <p className="text-gray-600">{project?.description}</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            Add Task
          </Button>
        </div>

        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Column
              title="To Do"
              status="todo"
              tasks={groupedTasks.todo}
              onTaskMove={handleTaskMove}
              onEditTask={(task) => {
                setEditingTask(task);
                setIsModalOpen(true);
                reset({
                  title: task.title,
                  description: task.description,
                  priority: task.priority,
                  deadline: task.deadline ? task.deadline.split('T')[0] : ''
                });
              }}
            />
            <Column
              title="In Progress"
              status="in-progress"
              tasks={groupedTasks['in-progress']}
              onTaskMove={handleTaskMove}
              onEditTask={(task) => {
                setEditingTask(task);
                setIsModalOpen(true);
                reset({
                  title: task.title,
                  description: task.description,
                  priority: task.priority,
                  deadline: task.deadline ? task.deadline.split('T')[0] : ''
                });
              }}
            />
            <Column
              title="Done"
              status="done"
              tasks={groupedTasks.done}
              onTaskMove={handleTaskMove}
              onEditTask={(task) => {
                setEditingTask(task);
                setIsModalOpen(true);
                reset({
                  title: task.title,
                  description: task.description,
                  priority: task.priority,
                  deadline: task.deadline ? task.deadline.split('T')[0] : ''
                });
              }}
            />
          </div>
        </DndProvider>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
            reset();
          }}
          title={editingTask ? 'Edit Task' : 'Create New Task'}
          size="md"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Task Title"
              error={errors.title?.message}
              {...register('title', { required: 'Task title is required' })}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                {...register('description')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  {...register('priority')}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <Input
                label="Deadline"
                type="date"
                {...register('deadline')}
              />
            </div>

            <div className="flex justify-between pt-4">
              {editingTask && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => deleteTask(editingTask._id)}
                >
                  Delete Task
                </Button>
              )}
              
              <div className="flex space-x-3 ml-auto">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTask(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}

export default function ProjectPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <KanbanBoard />
    </DndProvider>
  );
}