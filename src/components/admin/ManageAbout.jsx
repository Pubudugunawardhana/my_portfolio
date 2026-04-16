import React, { useState, useEffect } from 'react';
import { useAbout } from '../../hooks/useAbout';

export function ManageAbout() {
  const { aboutInfo, updateAbout } = useAbout();
  const [formData, setFormData] = useState({ name: '', role: '', shortBio: '', longBio: '', email: '' });
  const [savedStatus, setSavedStatus] = useState(false);

  // Sync form data once the hook loads it from localStorage
  useEffect(() => {
    if (aboutInfo.name) {
      setFormData(aboutInfo);
    }
  }, [aboutInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSavedStatus(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAbout(formData);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Manage About Section</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure your personal information and biography.</p>
        </div>
        {savedStatus && <span className="text-sm font-bold text-green-500 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">✓ Saved Successfully</span>}
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input required type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Professional Role</label>
              <input required type="text" name="role" value={formData.role || ''} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
              <input required type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Short Bio (Headline)</label>
              <textarea required name="shortBio" value={formData.shortBio || ''} onChange={handleChange} rows="2" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100 resize-none"></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Long Bio (Paragraph)</label>
              <textarea required name="longBio" value={formData.longBio || ''} onChange={handleChange} rows="5" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100 resize-y"></textarea>
            </div>

          </div>
          
          <div className="pt-4">
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors">
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
