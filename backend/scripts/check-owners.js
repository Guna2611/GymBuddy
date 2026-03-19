require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const owners = await User.find({ role: 'gymOwner' }).select('name email');
        console.log(`\nFound ${owners.length} gym owner(s):`);
        owners.forEach((owner, index) => {
            console.log(`${index + 1}. ${owner.name} (${owner.email})`);
        });
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
})();
