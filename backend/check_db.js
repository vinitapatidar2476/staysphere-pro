require('dotenv').config();
const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const hotels = await Hotel.find({});
    console.log(`Total hotels in DB: ${hotels.length}`);
    hotels.forEach(h => {
        console.log(`- ${h.name} (${h.city}) | Approved: ${h.isApproved}`);
    });
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
