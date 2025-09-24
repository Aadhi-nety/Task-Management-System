import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ProjectFormData {
  name: string;
  description: string;
}

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  initialData?: Partial<ProjectFormData>;
  isLoading?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, initialData, isLoading = false }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Project Name"
        error={errors.name?.message}
        {...register('name', { required: 'Project name is required' })}
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

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Project'}
      </Button>
    </form>
  );
};