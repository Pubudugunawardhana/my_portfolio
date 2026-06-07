// src/services/analyticsService.js

const API_URL = 'http://localhost:5000/api/analytics';

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
  // Mock aggregation for now
  return { views: 0, projects: 0, messages: 0 };
}
