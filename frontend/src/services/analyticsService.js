// src/services/analyticsService.js

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/analytics' : '/api/analytics';

export async function incrementPageViews() {
  try {
    const res = await fetch(`${API_URL}/increment`, {
      method: 'POST'
    });
    const data = await res.json();
    return data.views;
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return null;
  }
}

export function listenToDailyViews(callback) {
  // Simple polling instead of live listener
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const today = new Date().toISOString().split('T')[0];
      const todayStat = data.find(d => d.date === today);
      callback(todayStat ? todayStat.views : 0);
    })
    .catch(err => console.error(err));
    
  return () => {};
}

export async function getDashboardOverviewStats() {
  try {
    const projectsUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/projects' : '/api/projects';
    const messagesUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/messages' : '/api/messages';
    
    const [analyticsRes, projectsRes, messagesRes] = await Promise.all([
      fetch(API_URL),
      fetch(projectsUrl),
      fetch(messagesUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
    ]);

    const analyticsData = analyticsRes.ok ? await analyticsRes.json() : [];
    const projectsData = projectsRes.ok ? await projectsRes.json() : [];
    const messagesData = messagesRes.ok ? await messagesRes.json() : [];

    // Sum up all views across all dates
    const totalViews = Array.isArray(analyticsData) 
      ? analyticsData.reduce((sum, item) => sum + item.views, 0)
      : 0;

    return {
      views: totalViews,
      projects: Array.isArray(projectsData) ? projectsData.length : 0,
      messages: Array.isArray(messagesData) ? messagesData.length : 0
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { views: 0, projects: 0, messages: 0 };
  }
}
