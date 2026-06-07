import React, { useState, useRef } from 'react';
import { useCertifications } from '../../hooks/useCertifications';
import { UploadCloud, Award } from 'lucide-react';

export function ManageCertifications() {
  const { certifications, isLoading, addCertification, editCertification, deleteCertification } = useCertifications();
  
  const [formData, setFormData] = useState({ title: '', issuer: '', date: '', credentialUrl: '', image: '' });
  const [editingId, setEditingId] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPG, PNG, etc).');
      return;
    }

    setIsCompressing(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const base64Payload = canvas.toDataURL('image/jpeg', 0.8);
        
        setFormData((prev) => ({ ...prev, image: base64Payload }));
        setIsCompressing(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      editCertification(editingId, formData);
    } else {
      addCertification(formData);
    }

    setFormData({ title: '', issuer: '', date: '', credentialUrl: '', image: '' });
    setEditingId(null);
  };

  const handleEditClick = (cert) => {
    setEditingId(cert.id);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      credentialUrl: cert.credentialUrl,
      image: cert.image
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', issuer: '', date: '', credentialUrl: '', image: '' });
  };

  const handleDeleteClick = (id, title) => {
    if (window.confirm(`Are you absolutely sure you want to delete the certification "${title}"?\nThis cannot be undone.`)) {
      deleteCertification(id);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Award className="text-blue-500 w-8 h-8" />
          Manage Certifications
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Add, edit, or remove professional certifications and badges.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-10">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          {editingId ? "Edit Certification" : "Add New Certification"}
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
                placeholder="e.g. AWS Certified Developer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Issuer</label>
              <input 
                required 
                type="text" 
                name="issuer" 
                value={formData.issuer} 
                onChange={handleChange} 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100" 
                placeholder="e.g. Amazon Web Services"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input 
                required 
                type="text" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100" 
                placeholder="e.g. June 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Credential URL</label>
              <input 
                type="url" 
                name="credentialUrl" 
                value={formData.credentialUrl} 
                onChange={handleChange} 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100" 
                placeholder="Link to verify badge..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Certificate Image</label>
              
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden" 
              />

              <div className="flex items-center gap-4">
                {formData.image && (
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-white">
                    <img src={formData.image} alt="preview" className="w-full h-full object-contain" />
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex-1 flex flex-col items-center justify-center py-4 px-4 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <UploadCloud size={20} className="group-hover:text-blue-500 transition-colors" />
                    <span className="font-medium text-sm">
                      {isCompressing ? 'Compressing Image...' : (formData.image ? 'Change Certificate Image' : 'Select Certificate Photo')}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              {editingId ? "Save Changes" : "Publish Certification"}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={handleCancelEdit} 
                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Your Credentials</h3>
        
        {isLoading && certifications.length === 0 && (
          <div className="p-8 text-center text-slate-500 animate-pulse font-medium">
            Loading credentials from the cloud...
          </div>
        )}

        {!isLoading && certifications.length === 0 && (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
            No certifications found! Add your first badge above.
          </div>
        )}

        {certifications.map((cert) => (
          <div key={cert.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-6 items-center">
            
            {cert.image ? (
              <div className="w-full md:w-32 h-20 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center p-2">
                <img src={cert.image} alt="badge" className="w-full h-full object-contain" />
              </div>
            ) : (
               <div className="w-full md:w-32 h-20 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400">
                 <Award size={32} />
               </div>
            )}
            
            <div className="flex-1 w-full text-left">
              <h4 className="text-lg font-bold text-slate-800 dark:text-white">{cert.title}</h4>
              <p className="text-sm font-medium text-blue-500 dark:text-blue-400 mt-1">{cert.issuer}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Earned: {cert.date}</p>
            </div>

            <div className="flex w-full md:w-auto gap-3 shrink-0">
              <button 
                onClick={() => handleEditClick(cert)} 
                className="flex-1 md:flex-none px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDeleteClick(cert.id, cert.title)} 
                className="flex-1 md:flex-none px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
