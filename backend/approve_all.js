require('dotenv').config();
const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('MongoDB connected. Approving all hotels...');
    const res = await Hotel.updateMany({}, { isApproved: true });
    console.log(`Approved ${res.modifiedCount} hotels.`);
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
