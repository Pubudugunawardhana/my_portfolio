import React, { useState, useEffect } from 'react';
import { getContactMessages, deleteContactMessage, toggleMessageReadStatus } from '../../services/messageService';
import { Trash2, Mail, MailOpen } from 'lucide-react';

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this message?")) {
      try {
        await deleteContactMessage(id);
        setMessages(messages.filter(msg => msg.id !== id));
      } catch (error) {
        alert("Failed to delete message.");
      }
    }
  };

  const handleToggleRead = async (id, currentStatus) => {
    try {
      await toggleMessageReadStatus(id, currentStatus);
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, readStatus: !currentStatus } : msg
      ));
    } catch (error) {
      alert("Failed to update message status.");
    }
  };

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
              <div 
                key={msg.id} 
                className={`p-5 border rounded-xl hover:shadow-md transition-all ${
                  msg.readStatus 
                    ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 opacity-70' 
                    : 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-slate-800 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-3 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleToggleRead(msg.id, msg.readStatus)}
                      className={`mt-1 p-2 rounded-full transition-colors ${msg.readStatus ? 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-blue-600 bg-blue-100 hover:bg-blue-200 dark:text-blue-400 dark:bg-blue-900/50 dark:hover:bg-blue-900'}`}
                      title={msg.readStatus ? "Mark as unread" : "Mark as read"}
                    >
                      {msg.readStatus ? <MailOpen size={18} /> : <Mail size={18} />}
                    </button>
                    <div>
                      <h4 className={`font-bold text-lg ${msg.readStatus ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                        {msg.name}
                        {!msg.readStatus && <span className="ml-2 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">NEW</span>}
                      </h4>
                      <a href={`mailto:${msg.email}`} className="text-blue-500 hover:text-blue-600 text-sm">{msg.email}</a>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-semibold text-slate-500 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Delete message"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className={`whitespace-pre-wrap leading-relaxed pl-12 ${msg.readStatus ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
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
