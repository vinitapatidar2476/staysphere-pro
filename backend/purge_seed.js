require('dotenv').config();
const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

const purgeSeeded = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const seededNames = [
            "Aman-i-Khas",
            "The Oberoi Amarvilas",
            "Taj Lake Palace",
            "Wildflower Hall",
            "Indore Royal Heritage",
            "The Blue City Retreat"
        ];
        
        console.log('--- Database Purge Initiated ---');
        // Delete by name match
        const result = await Hotel.deleteMany({ name: { $in: seededNames } });
        console.log(`Successfully removed ${result.deletedCount} default flagship properties.`);
        
        // Find orphans (rooms with no hotel)
        const allHotels = await Hotel.find({}, '_id');
        const hotelIds = allHotels.map(h => h._id);
        const roomResult = await Room.deleteMany({ hotelId: { $nin: hotelIds } });
        console.log(`Successfully removed ${roomResult.deletedCount} orphaned room inventory nodes.`);

        console.log('--- Purge Cycle Complete ---');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
purgeSeeded();
