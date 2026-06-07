import React, { useState, useEffect } from 'react';
import { getAboutFromFirebase, updateAboutInFirebase } from '../../services/aboutService';

export function ManageAbout() {
  const [formData, setFormData] = useState({ name: '', role: '', location: '', shortBio: '', longBio: '', email: '', github: '', linkedin: '', medium: '', school: '', university: '', profileImage: '', coverImage: '' });
  const [savedStatus, setSavedStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync form data once it loads securely from Firebase Cloud
  useEffect(() => {
    const fetchExistingBio = async () => {
      try {
        const cloudData = await getAboutFromFirebase();
        if (cloudData) {
          setFormData(cloudData);
        }
      } catch (error) {
        console.error("ManageAbout fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExistingBio();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSavedStatus(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAboutInFirebase(formData);
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save to cloud. Check console for details.");
    }
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
        {isLoading ? (
           <p className="text-slate-500 font-medium animate-pulse py-8 text-center">Loading Cloud Storage...</p>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input required type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Profile Image URL</label>
              <input type="url" name="profileImage" value={formData.profileImage || ''} onChange={handleChange} placeholder="https://example.com/my-photo.jpg" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cover Image URL</label>
              <input type="url" name="coverImage" value={formData.coverImage || ''} onChange={handleChange} placeholder="https://example.com/my-banner.jpg" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
              <input required type="text" name="location" value={formData.location || ''} onChange={handleChange} placeholder="e.g. Colombo, Sri Lanka" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
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
          
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub Profile URL</label>
              <input type="url" name="github" value={formData.github || ''} onChange={handleChange} placeholder="https://github.com/yourusername" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">LinkedIn Profile URL</label>
              <input type="url" name="linkedin" value={formData.linkedin || ''} onChange={handleChange} placeholder="https://linkedin.com/in/yourusername" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Medium Profile URL</label>
              <input type="url" name="medium" value={formData.medium || ''} onChange={handleChange} placeholder="https://medium.com/@yourusername" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Educational Background</h3>
          <div className="grid grid-cols-1 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">University / College</label>
              <input type="text" name="university" value={formData.university || ''} onChange={handleChange} placeholder="e.g. University of Moratuwa" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">School</label>
              <input type="text" name="school" value={formData.school || ''} onChange={handleChange} placeholder="e.g. Royal College, Colombo" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
            </div>
          </div>
          
          <div className="pt-4">
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors">
              Save Profile to Cloud
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
