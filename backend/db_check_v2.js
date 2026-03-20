require('dotenv').config();
const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const hotels = await Hotel.find();
        console.log('HOTEL_AUDIT_START');
        console.log(`COUNT:${hotels.length}`);
        hotels.forEach((h, i) => {
            console.log(`HOTEL:${h.name}|APP:${h.isApproved}|ID:${h._id}`);
        });
        console.log('HOTEL_AUDIT_END');
        process.exit();
    } catch (err) {
        process.exit(1);
    }
}
check();
