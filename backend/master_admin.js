require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const createMasterAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const adminExist = await User.findOne({ email: 'admin@stayease.com' });
        if (adminExist) {
            await User.deleteOne({ email: 'admin@stayease.com' });
            console.log('Old Admin cleared.');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const masterAdmin = new User({
            name: 'Root Administrator',
            email: 'admin@stayease.com',
            password: hashedPassword,
            role: 'admin'
        });

        await masterAdmin.save();
        console.log('-----------------------------------');
        console.log('MASTER ADMIN CREATED SUCCESSFULLY!');
        console.log('Email: admin@stayease.com');
        console.log('Password: admin123');
        console.log('-----------------------------------');
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createMasterAdmin();
