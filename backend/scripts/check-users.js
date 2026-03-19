require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const admins = await User.find({ role: 'admin' }).select('name email');
        console.log(`--- ADMINS (${admins.length}) ---`);
        if (admins.length === 0) console.log('No admins found.');
        admins.forEach((u, i) => console.log(`${i + 1}. ${u.name || '(No Name)'} (${u.email})`));

        const users = await User.find({ role: 'user' }).select('name email');
        console.log(`\n--- USERS (${users.length}) ---`);
        if (users.length === 0) console.log('No regular users found.');
        users.forEach((u, i) => console.log(`${i + 1}. ${u.name || '(No Name)'} (${u.email})`));
        
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
})();
