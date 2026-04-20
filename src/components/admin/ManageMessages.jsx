import React, { useState, useEffect } from 'react';
import { getContactMessages } from '../../services/messageService';

export function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getContactMessages();
        setMessages(data);
      } catch (error) {
        console.error("ManageMessages fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Manage Messages</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Read messages submitted through your portfolio contact form.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-10">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <p className="text-slate-500 font-medium animate-pulse">Loading Messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center p-8 text-slate-500">
            <p>No messages found in your inbox yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow bg-slate-50 dark:bg-slate-900/50">
                <div className="flex justify-between items-start mb-3 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">{msg.name}</h4>
                    <a href={`mailto:${msg.email}`} className="text-blue-500 hover:text-blue-600 text-sm">{msg.email}</a>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
