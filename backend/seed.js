require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('MongoDB connected for seeding...');
    
    const adminExists = await User.findOne({ email: 'admin@stayease.com' });
    if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('admin123', salt);
        
        await User.create({
            name: 'Super Admin',
            email: 'admin@stayease.com',
            password,
            role: 'admin'
        });
        console.log('Admin user created: admin@stayease.com / admin123');
    } else {
        console.log('Admin user already exists');
    }
    
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
