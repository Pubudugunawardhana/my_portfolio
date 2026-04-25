import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { FolderOpen, Award, User, MessageSquare } from 'lucide-react';
import { ManageProjects } from './ManageProjects';
import { ManageSkills } from './ManageSkills';
import { ManageAbout } from './ManageAbout';
import { ManageMessages } from './ManageMessages';
import { ManageProfile } from './ManageProfile';
import { ManageCertifications } from './ManageCertifications';
import { AnalyticsChart } from './AnalyticsChart';
import { getDashboardOverviewStats } from '../../services/analyticsService';

export function AdminDashboard() {
  const [stats, setStats] = useState({ views: 0, projects: 0, messages: 0 });

  useEffect(() => {
    // Fire a parallel fetch on Admin mount
    getDashboardOverviewStats().then(data => {
      setStats(data);
    });
  }, []);
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans mt-0 selection:bg-blue-500 selection:text-white">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
        <main className="p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            {/* Header Placeholder */}
            <div className="mb-10">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back, Admin
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Here's what's happening with your portfolio today.
              </p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Total Views</p>
                <p className="text-4xl font-black text-slate-800 dark:text-white">{stats.views.toLocaleString()}</p>
                <div className="absolute top-0 right-0 p-4 opacity-5 bg-blue-500 rounded-bl-full w-24 h-24 pointer-events-none"></div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Messages</p>
                <p className="text-4xl font-black text-slate-800 dark:text-white">{stats.messages.toLocaleString()}</p>
                <div className="absolute top-0 right-0 p-4 opacity-5 bg-green-500 rounded-bl-full w-24 h-24 pointer-events-none"></div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Projects</p>
                <p className="text-4xl font-black text-slate-800 dark:text-white">{stats.projects.toLocaleString()}</p>
                <div className="absolute top-0 right-0 p-4 opacity-5 bg-purple-500 rounded-bl-full w-24 h-24 pointer-events-none"></div>
              </div>
            </div>

            {/* Nested Content Based on Sidebar Selection */}
            <Routes>
              <Route path="/" element={
                 <div className="space-y-8">
                   <AnalyticsChart />
                   
                   <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                   <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700">
                     <h3 className="text-xl font-bold text-slate-800 dark:text-white">Quick Actions</h3>
                   </div>
                   <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                     
                     <Link to="/admin/projects" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800 transition-all group">
                       <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                         <FolderOpen size={24} />
                       </div>
                       <div className="text-left">
                         <h4 className="font-bold text-slate-800 dark:text-white">New Project</h4>
                         <p className="text-sm text-slate-500">Upload to gallery</p>
                       </div>
                     </Link>

                     <Link to="/admin/certifications" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 bg-slate-50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800 transition-all group">
                       <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                         <Award size={24} />
                       </div>
                       <div className="text-left">
                         <h4 className="font-bold text-slate-800 dark:text-white">Add Certificate</h4>
                         <p className="text-sm text-slate-500">Showcase credentials</p>
                       </div>
                     </Link>

                     <Link to="/admin/profile" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 bg-slate-50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800 transition-all group">
                       <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
                         <User size={24} />
                       </div>
                       <div className="text-left">
                         <h4 className="font-bold text-slate-800 dark:text-white">Edit Profile</h4>
                         <p className="text-sm text-slate-500">Update Hero details</p>
                       </div>
                     </Link>

                     <Link to="/admin/messages" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800 transition-all group">
                       <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                         <MessageSquare size={24} />
                       </div>
                       <div className="text-left">
                         <h4 className="font-bold text-slate-800 dark:text-white">Inbox</h4>
                         <p className="text-sm text-slate-500">Check new messages</p>
                       </div>
                     </Link>

                   </div>
                 </div>
                 </div>
              } />
              <Route path="/projects" element={<ManageProjects />} />
              <Route path="/skills" element={<ManageSkills />} />
              <Route path="/about" element={<ManageAbout />} />
              <Route path="/certifications" element={<ManageCertifications />} />
              <Route path="/messages" element={<ManageMessages />} />
              <Route path="/profile" element={<ManageProfile />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
