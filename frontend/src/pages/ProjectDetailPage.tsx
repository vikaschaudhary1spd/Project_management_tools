import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsAPI } from '../api/projects';
import { tasksAPI } from '../api/tasks';
import { Project, Task, TaskStatus } from '../types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format } from 'date-fns';
import { ArrowLeft, Plus, Loader2, Trash2, Edit2, Clock, CheckCircle2, Circle } from 'lucide-react';

const taskSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  status: yup.string().oneOf(['todo', 'in-progress', 'done']).default('todo'),
  due_date: yup.string().nullable(),
});

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id as string, 10);
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(taskSchema),
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const projData = await projectsAPI.getProject(projectId);
      setProject(projData);
      
      const params: any = { project: projectId };
      if (filter) params.status = filter;
      const tasksData = await tasksAPI.getTasks(params);
      setTasks(tasksData.results);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId, filter]);

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setValue('title', task.title);
      setValue('description', task.description || '');
      setValue('status', task.status);
      setValue('due_date', task.due_date || '');
    } else {
      setEditingTask(null);
      reset({ title: '', description: '', status: 'todo', due_date: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    reset();
  };

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        project: projectId,
        due_date: data.due_date || null
      };
      
      if (editingTask) {
        await tasksAPI.updateTask(editingTask.id, payload);
      } else {
        await tasksAPI.createTask(payload);
      }
      fetchData();
      closeModal();
    } catch (error) {
      console.error('Failed to save task', error);
    }
  };

  const handleDelete = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(taskId);
        fetchData();
      } catch (error) {
        console.error('Failed to delete task', error);
      }
    }
  };

  const updateTaskStatus = async (task: Task, newStatus: TaskStatus) => {
    try {
      await tasksAPI.updateTask(task.id, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  if (isLoading && !project) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!project) return <div className="text-center py-20 text-white">Project not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="card p-6 md:p-8 mb-8 border-t-4 border-t-primary-500">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{project.title}</h1>
              <span className={`badge ${project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                {project.status === 'active' ? 'Active' : 'Completed'}
              </span>
            </div>
            <p className="text-slate-300 max-w-3xl">{project.description}</p>
          </div>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 shrink-0">
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {['', 'todo', 'in-progress', 'done'].map((statusOption) => (
          <button
            key={statusOption}
            onClick={() => setFilter(statusOption)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === statusOption
                ? 'bg-primary-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {statusOption === '' ? 'All Tasks' : statusOption.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20 card bg-slate-900/50 border-dashed border-slate-700">
          <p className="text-slate-400 mb-4">No tasks found matching this criteria.</p>
          <button onClick={() => openModal()} className="btn-secondary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create First Task
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="card p-4 hover:border-slate-700 transition-colors flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex items-start gap-4 flex-1">
                <button 
                  onClick={() => updateTaskStatus(task, task.status === 'done' ? 'todo' : 'done')}
                  className="mt-1 flex-shrink-0"
                >
                  {task.status === 'done' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-600 hover:text-primary-400 transition-colors" />
                  )}
                </button>
                <div>
                  <h3 className={`text-lg font-semibold ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-white'}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-slate-400 text-sm mt-1">{task.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-medium">
                    <span className={`px-2 py-1 rounded-md ${
                      task.status === 'todo' ? 'bg-slate-800 text-slate-300' :
                      task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {task.status.replace('-', ' ').toUpperCase()}
                    </span>
                    {task.due_date && (
                      <span className={`flex items-center gap-1 ${
                        new Date(task.due_date) < new Date() && task.status !== 'done' ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(task.due_date), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                <button onClick={() => openModal(task)} className="btn-secondary p-2 group">
                  <Edit2 className="w-4 h-4 text-slate-400 group-hover:text-white" />
                </button>
                <button onClick={() => handleDelete(task.id)} className="btn-secondary p-2 hover:bg-red-500/10 group">
                  <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="card w-full max-w-md p-6 relative animate-slide-up border-slate-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingTask ? 'Edit Task' : 'New Task'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input
                  type="text"
                  {...register('title')}
                  className={`input ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Task title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>}
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="input resize-none"
                  placeholder="Additional details..."
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Status</label>
                  <select {...register('status')} className="input">
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="label">Due Date</label>
                  <input
                    type="date"
                    {...register('due_date')}
                    className="input"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-8">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
