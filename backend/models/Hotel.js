const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    description: { type: String },
    images: [{ type: String }],
    amenities: [{ type: String }],
    minPrice: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
