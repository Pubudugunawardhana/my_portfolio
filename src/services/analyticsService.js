// src/services/analyticsService.js
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

const ANALYTICS_DOC_REF = doc(db, 'analytics', 'visitors');

export async function incrementPageViews() {
  try {
    const docSnap = await getDoc(ANALYTICS_DOC_REF);
    if (!docSnap.exists()) {
      await setDoc(ANALYTICS_DOC_REF, { totalViews: 1 });
    } else {
      await updateDoc(ANALYTICS_DOC_REF, { totalViews: increment(1) });
    }
  } catch (error) {
    console.error("View increment failed", error);
  }
}

export async function getDashboardOverviewStats() {
  try {
    // 1. Get Views
    let views = 0;
    const viewsSnap = await getDoc(ANALYTICS_DOC_REF);
    if (viewsSnap.exists()) {
      views = viewsSnap.data().totalViews;
    }

    // 2. Get Projects Length
    const projectsSnap = await getDocs(collection(db, 'projects'));
    const projectsCount = projectsSnap.empty ? 0 : projectsSnap.size;

    // 3. Get Messages Length
    const messagesSnap = await getDocs(collection(db, 'messages'));
    const messagesCount = messagesSnap.empty ? 0 : messagesSnap.size;

    return {
      views,
      projects: projectsCount,
      messages: messagesCount
    };
  } catch (error) {
    console.error("Failed to load dashboard stats: ", error);
    return { views: 0, projects: 0, messages: 0 };
  }
}
