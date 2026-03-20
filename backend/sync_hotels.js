require('dotenv').config();
const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');

const sync = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        // Approve first 6 (seeded)
        const hotels = await Hotel.find().sort({ createdAt: 1 });
        for(let i=0; i<6 && i<hotels.length; i++) {
            hotels[i].isApproved = true;
            await hotels[i].save();
        }
        // Keep the 7th (if exists) as false
        if (hotels.length > 6) {
            hotels[6].isApproved = false;
            await hotels[6].save();
        }
        console.log('Sync Complete');
        process.exit();
    } catch (err) {
        process.exit(1);
    }
}
sync();
