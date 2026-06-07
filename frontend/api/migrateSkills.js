require('dotenv').config();
const mongoose = require('mongoose');
const Skill = require('./models/Skill');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyA1A3OLToXhOWQQdxxxVMVM5V8OrmPObXQ",
  authDomain: "my-portfolio-89169.firebaseapp.com",
  projectId: "my-portfolio-89169",
  storageBucket: "my-portfolio-89169.firebasestorage.app",
  messagingSenderId: "515991294284",
  appId: "1:515991294284:web:fbc4b8d124415cf3e27fe9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'myportfolio');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to DB. Migrating skills...');
  const snap = await getDocs(collection(db, 'skills'));
  
  await Skill.deleteMany({}); // Clear existing
  
  for (const doc of snap.docs) {
    const data = doc.data();
    await Skill.create(data);
    console.log('Migrated skill:', data.name);
  }
  
  console.log('Migration complete!');
  process.exit(0);
}).catch(console.error);
