import React, { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';

export function ManageProjects() {
  const { projects, addProject, editProject, deleteProject } = useProjects();
  
  // Form state
  const [formData, setFormData] = useState({ title: '', description: '', image: '', githubUrl: '', liveUrl: '', tech: '' });
  // If editingId is null, we are in "Add Mode". If it holds an ID, we are in "Edit Mode".
  const [editingId, setEditingId] = useState(null);

  // Safely handles user typing into any input field
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Quick sanitization to ensure 'tech' is saved as an Array if typed as a comma-separated list
    let techArray = [];
    if (typeof formData.tech === 'string') {
      techArray = formData.tech.split(',').map(item => item.trim()).filter(Boolean);
    } else {
      techArray = formData.tech;
    }

    const compiledProject = { 
        ...formData, 
        tech: techArray 
    };

    if (editingId) {
      editProject(editingId, compiledProject);
    } else {
      addProject(compiledProject);
    }

    // Reset the form
    setFormData({ title: '', description: '', image: '', githubUrl: '', liveUrl: '', tech: '' });
    setEditingId(null);
  };

  const handleEditClick = (project) => {
    setEditingId(project.id);
    // Load existing project data directly into the inputs
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      tech: Array.isArray(project.tech) ? project.tech.join(', ') : project.tech
    });
    // Scroll window smoothly to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', image: '', githubUrl: '', liveUrl: '', tech: '' });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Manage Projects</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Add, edit, or remove items from your portfolio gallery.</p>
      </div>

      {/* Entry Form */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-10">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          {editingId ? "Edit Project" : "Add New Project"}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
              <input 
                required 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
              <input 
                required 
                type="url" 
                name="image" 
                value={formData.image} 
                onChange={handleChange} 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                placeholder="https://images.unsplash.com/..." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub Link</label>
              <input 
                type="url" 
                name="githubUrl" 
                value={formData.githubUrl} 
                onChange={handleChange} 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Live Demo Link</label>
              <input 
                type="url" 
                name="liveUrl" 
                value={formData.liveUrl} 
                onChange={handleChange} 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Technologies (comma separated)</label>
              <input 
                type="text" 
                name="tech" 
                value={formData.tech} 
                onChange={handleChange} 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                placeholder="React, Tailwind, Node.js" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea 
                required 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="3" 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100 resize-none" 
              ></textarea>
            </div>
          </div>
          
          <div className="flex gap-4 pt-2">
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              {editingId ? "Save Changes" : "Create Project"}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={handleCancelEdit} 
                className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Existing Log Output */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Active Projects</h3>
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-6 items-center">
            
            <img src={project.image} alt="preview" className="w-full md:w-40 h-24 object-cover rounded-xl" />
            
            <div className="flex-1 w-full text-left">
              <h4 className="text-lg font-bold text-slate-800 dark:text-white">{project.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{project.description}</p>
            </div>

            <div className="flex w-full md:w-auto gap-3 shrink-0">
              <button 
                onClick={() => handleEditClick(project)} 
                className="flex-1 md:flex-none px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={() => deleteProject(project.id)} 
                className="flex-1 md:flex-none px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              >
                Delete
              </button>
            </div>

          </div>
        ))}

        {projects.length === 0 && (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
            No projects found! Use the form above to add one.
          </div>
        )}
      </div>

    </div>
  );
}
