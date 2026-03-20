require('dotenv').config();
const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const hotels = await Hotel.find();
        console.log('--- Database Audit ---');
        console.log(`Total Hotels found: ${hotels.length}`);
        hotels.forEach((h, i) => {
            console.log(`${i+1}. Name: ${h.name} | Approved: ${h.isApproved} | City: ${h.city}`);
        });
        console.log('----------------------');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
