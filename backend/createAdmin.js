require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to DB. Creating admin...');
  const email = 'pubudugunawardhana23@gmail.com'; // Using their real email
  const password = 'pubudugunawardhana23'; // Using their password
  
  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({ email, password });
    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
  } else {
    // Force update password
    existing.password = password;
    await existing.save();
    console.log('✅ Admin user password updated!');
    console.log('Email:', email);
    console.log('Password:', password);
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
