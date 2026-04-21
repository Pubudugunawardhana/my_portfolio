import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ManageProjects } from './ManageProjects';
import { ManageSkills } from './ManageSkills';
import { ManageAbout } from './ManageAbout';
import { ManageMessages } from './ManageMessages';
import { ManageProfile } from './ManageProfile';

export function AdminDashboard() {
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

            {/* Dashboard Cards (Placeholder overview) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Total Views</p>
                <p className="text-4xl font-black text-slate-800 dark:text-white">1,204</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Messages</p>
                <p className="text-4xl font-black text-slate-800 dark:text-white">12</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Projects</p>
                <p className="text-4xl font-black text-slate-800 dark:text-white">3</p>
              </div>
            </div>

            {/* Nested Content Based on Sidebar Selection */}
            <Routes>
              <Route path="/" element={
                 <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                   <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700">
                     <h3 className="text-xl font-bold text-slate-800 dark:text-white">Quick Actions</h3>
                   </div>
                   <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                     <p>Select an option from the sidebar to start managing your dynamic content.</p>
                   </div>
                 </div>
              } />
              <Route path="/projects" element={<ManageProjects />} />
              <Route path="/skills" element={<ManageSkills />} />
              <Route path="/about" element={<ManageAbout />} />
              <Route path="/messages" element={<ManageMessages />} />
              <Route path="/profile" element={<ManageProfile />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
