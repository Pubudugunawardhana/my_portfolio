import React, { useState } from 'react';
import { useSkills } from '../../hooks/useSkills';

export function ManageSkills() {
  const { skills, addSkillCategory, updateSkillCategory, deleteSkillCategory } = useSkills();
  
  const [formData, setFormData] = useState({ name: '', tech: '' });
  const [editingName, setEditingName] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert comma separated string to array
    let techArray = [];
    if (typeof formData.tech === 'string') {
      techArray = formData.tech.split(',').map(item => item.trim()).filter(Boolean);
    } else {
      techArray = formData.tech;
    }

    const compiledCategory = { 
        name: formData.name, 
        tech: techArray 
    };

    if (editingName) {
      updateSkillCategory(editingName, compiledCategory);
    } else {
      addSkillCategory(compiledCategory);
    }

    setFormData({ name: '', tech: '' });
    setEditingName(null);
  };

  const handleEditClick = (skill) => {
    setEditingName(skill.name);
    setFormData({
      name: skill.name,
      tech: Array.isArray(skill.tech) ? skill.tech.join(', ') : skill.tech
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingName(null);
    setFormData({ name: '', tech: '' });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Manage Skills</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Organize your technical knowledge and tools mapping.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-10">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          {editingName ? "Edit Skill Category" : "Add New Category"}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Frontend Development" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Technologies (comma separated)</label>
              <textarea required name="tech" value={formData.tech} onChange={handleChange} placeholder="React, Vue, HTML, CSS" rows="3" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100 resize-none"></textarea>
            </div>
          </div>
          
          <div className="flex gap-4 pt-2">
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors">
              {editingName ? "Save Changes" : "Add Category"}
            </button>
            {editingName && (
              <button type="button" onClick={handleCancelEdit} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white font-semibold rounded-lg transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Active Categories</h3>
        {skills.map((skill) => (
          <div key={skill.name} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-6 items-center justify-between">
            
            <div className="flex-1 w-full text-left">
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{skill.name}</h4>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(skill.tech) && skill.tech.map((t) => (
                  <span key={t} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">{t}</span>
                ))}
              </div>
            </div>

            <div className="flex w-full md:w-auto gap-3 shrink-0">
              <button onClick={() => handleEditClick(skill)} className="flex-1 md:flex-none px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-200 transition-colors">
                Edit
              </button>
              <button onClick={() => deleteSkillCategory(skill.name)} className="flex-1 md:flex-none px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors">
                Delete
              </button>
            </div>

          </div>
        ))}

        {skills.length === 0 && (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
            No active skill categories found.
          </div>
        )}
      </div>
    </div>
  );
}
