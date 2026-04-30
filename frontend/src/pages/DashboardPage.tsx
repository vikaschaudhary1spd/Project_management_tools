import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../api/projects';
import { Project, ProjectStatus } from '../types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format } from 'date-fns';
import { Plus, FolderKanban, MoreVertical, Trash2, Edit2, Loader2, Search, ArrowRight } from 'lucide-react';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  status: yup.string().oneOf(['active', 'completed']).default('active'),
});

const DashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchProjects = async (search = '') => {
    try {
      setIsLoading(true);
      const data = await projectsAPI.getProjects({ search });
      setProjects(data.results);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjects(searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setValue('title', project.title);
      setValue('description', project.description || '');
      setValue('status', project.status);
    } else {
      setEditingProject(null);
      reset({ title: '', description: '', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    reset();
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingProject) {
        await projectsAPI.updateProject(editingProject.id, data);
      } else {
        await projectsAPI.createProject(data);
      }
      fetchProjects(searchQuery);
      closeModal();
    } catch (error) {
      console.error('Failed to save project', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.deleteProject(id);
        fetchProjects(searchQuery);
      } catch (error) {
        console.error('Failed to delete project', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 mt-1">Manage your workspaces and tasks.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-500" />
        </div>
        <input
          type="text"
          placeholder="Search projects..."
          className="input pl-10 max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 card bg-slate-900/50 border-dashed border-slate-700">
          <FolderKanban className="mx-auto h-12 w-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-300">No projects found</h3>
          <p className="mt-1 text-slate-500">Get started by creating a new project.</p>
          <button onClick={() => openModal()} className="mt-6 btn-secondary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="card group hover:border-primary-500/50 transition-colors duration-300 flex flex-col h-full">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`badge ${project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                    {project.status === 'active' ? 'Active' : 'Completed'}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(project)} className="text-slate-400 hover:text-white transition-colors p-1">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="text-slate-400 hover:text-red-400 transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1" title={project.title}>
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
                  {project.description || 'No description provided.'}
                </p>
              </div>
              <div className="px-6 py-4 border-t border-slate-800 flex justify-between items-center bg-slate-800/30 rounded-b-2xl">
                <span className="text-xs text-slate-500 font-medium">
                  Created {format(new Date(project.created_at), 'MMM d, yyyy')}
                </span>
                <Link
                  to={`/projects/${project.id}`}
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  View Tasks
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="card w-full max-w-md p-6 relative animate-slide-up border-slate-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingProject ? 'Edit Project' : 'New Project'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input
                  type="text"
                  {...register('title')}
                  className={`input ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="e.g. Website Redesign"
                />
                {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>}
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="input resize-none"
                  placeholder="What is this project about?"
                ></textarea>
              </div>
              {editingProject && (
                <div>
                  <label className="label">Status</label>
                  <select {...register('status')} className="input">
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              )}
              <div className="flex gap-3 justify-end mt-8">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
