require('dotenv').config();
const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('Clearing all demo hotels and rooms...');
    await Hotel.deleteMany({});
    await Room.deleteMany({});
    console.log('Database cleared. Ready for manager data.');
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
