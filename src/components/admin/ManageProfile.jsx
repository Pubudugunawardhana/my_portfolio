import React, { useState, useEffect, useRef } from 'react';
import { getAboutFromFirebase, updateAboutInFirebase } from '../../services/aboutService';
import { Save, Image as ImageIcon, UploadCloud } from 'lucide-react';

export function ManageProfile() {
  const [profileImage, setProfileImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isCompressingCover, setIsCompressingCover] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getAboutFromFirebase();
        if (data) {
          if (data.profileImage) setProfileImage(data.profileImage);
          if (data.coverImage) setCoverImage(data.coverImage);
        }
      } catch (error) {
        console.error("Failed to load profile settings.", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
        // Optimal sizing for a standard React portfolio hero avatar
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        // Smart proportional resizing
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

        // Draw and squash the physical memory footprint
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert heavily optimized representation to a Base64 string payload!
        // We use JPEG format at 70% quality to easily slide under Firestore's 1MB limit.
        const base64Payload = canvas.toDataURL('image/jpeg', 0.7);
        
        setProfileImage(base64Payload);
        setIsCompressing(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPG, PNG, etc).');
      return;
    }

    setIsCompressingCover(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Banner aspect ratio (wide)
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 600;
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
        setCoverImage(base64Payload);
        setIsCompressingCover(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    
    try {
      await updateAboutInFirebase({ profileImage, coverImage });
      setSuccessMsg('Images saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      alert("Failed to save profile image.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Manage Profile</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Upload your primary Hero avatar directly from your device.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <p className="text-slate-500 animate-pulse font-medium">Loading profile settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                    Profile Photo
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                    Select a high-quality portrait photo from your computer. Our engine will automatically compress and optimize it for the web.
                  </p>
                  
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden" // Hide the ugly default input
                  />
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="w-full flex flex-col items-center justify-center py-8 px-4 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                  >
                    <UploadCloud className="w-10 h-10 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {isCompressing ? 'Compressing Image...' : 'Click to select a file'}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">PNG, JPG, JPEG</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-8 py-3 text-white font-bold rounded-xl shadow-md transition-all ${isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    <Save size={18} />
                    {isSaving ? 'Saving...' : 'Save Avatar'}
                  </button>
                  
                  {successMsg && (
                    <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-md inline-block">
                      {successMsg}
                    </p>
                  )}
                </div>
              </div>

              {/* Dynamic Image Preview */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Live Preview</p>
                <div className="w-48 h-64 rounded-[2rem] border-4 border-slate-300 dark:border-slate-600 shadow-xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop";
                      }}
                    />
                  ) : (
                    <ImageIcon className="text-slate-400 dark:text-slate-600 w-16 h-16 opacity-50" />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-12 pt-12 border-t border-slate-200 dark:border-slate-800">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                    Cover Banner Photo
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                    Select a wide landscape photo for your background banner.
                  </p>
                  
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleCoverChange}
                    ref={coverInputRef}
                    className="hidden" 
                  />
                  
                  <button
                    type="button"
                    onClick={() => coverInputRef.current.click()}
                    className="w-full flex flex-col items-center justify-center py-8 px-4 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                  >
                    <UploadCloud className="w-10 h-10 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {isCompressingCover ? 'Compressing Image...' : 'Click to select cover file'}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">PNG, JPG, JPEG</span>
                  </button>
                </div>
              </div>

              {/* Cover Image Preview */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center w-full h-full min-h-[250px]">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Banner Preview</p>
                <div className="w-full max-w-sm h-32 rounded-xl border-4 border-slate-300 dark:border-slate-600 shadow-xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                  {coverImage ? (
                    <img 
                      src={coverImage} 
                      alt="Cover Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="text-slate-400 dark:text-slate-600 w-10 h-10 opacity-50" />
                  )}
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
