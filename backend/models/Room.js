const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    type: { type: String, required: true }, // e.g. Single, Double, Suite
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    totalRooms: { type: Number, required: true, default: 1 },
    availableRooms: { type: Number, required: true, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
