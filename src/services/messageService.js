// src/services/messageService.js

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/messages' : '/api/messages';

const getHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export async function submitContactMessage(messageData) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData)
  });
  if (!res.ok) throw new Error('Failed to send message');
}

export function listenToMessages(callback) {
  fetch(API_URL, { headers: getHeaders() })
    .then(res => res.json())
    .then(data => callback(data.map(m => ({ ...m, id: m._id }))))
    .catch(err => console.error(err));
  return () => {};
}

export async function markMessageAsRead(messageId) {
  const res = await fetch(`${API_URL}/${messageId}/read`, {
    method: 'PUT',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to mark message as read');
}

export async function deleteMessage(messageId) {
  const res = await fetch(`${API_URL}/${messageId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete message');
}

export const getContactMessages = async () => {
  const res = await fetch(API_URL, { headers: getHeaders() });
  const data = await res.json();
  return data.map(m => ({ ...m, id: m._id }));
};

export const deleteContactMessage = deleteMessage;
export const toggleMessageReadStatus = markMessageAsRead;
