const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Get all approved hotels (Public)
router.get('/', async (req, res) => {
    try {
        const { city, search, minPrice, rating, amenity } = req.query;
        let query = { isApproved: true };
        
        if (city) query.city = new RegExp(city, 'i');
        
        // Price: Find hotels with minPrice <= ceiling (but exclude 0 if ceiling is high, 
        // or treat 0 as potentially unpopulated)
        if (minPrice && Number(minPrice) > 0) {
            query.minPrice = { $lte: Number(minPrice) };
        }
        
        // Rating: Find hotels with avgRating >= floor, 
        // but if it's a new hotel (0), we can optionally show it or keep it filtered.
        // For better UX during development, we'll allow 0-rated hotels if 
        // the user is just browsing (but if they specifically pick a high rating, they might want to hide 0s).
        if (rating && Number(rating) > 0) {
            // Include hotels with >= rating OR new/unrated ones (0)
            query.$and = query.$and || [];
            query.$and.push({
                $or: [
                    { avgRating: { $gte: Number(rating) } },
                    { avgRating: 0 }
                ]
            });
        }
        
        if (amenity) {
            const amenityList = amenity.split(',');
            // Using $in (OR) for flexibility
            query.amenities = { $in: amenityList.map(a => new RegExp(a, 'i')) };
        }

        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { city: new RegExp(search, 'i') },
                { amenities: new RegExp(search, 'i') }
            ];
        }

        console.log('Search Query Received:', query);
        const hotels = await Hotel.find(query);
        console.log(`Found ${hotels.length} hotels.`);
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Get all hotels
router.get('/all', verifyToken, verifyRole(['admin']), async (req, res) => {
    try {
        const hotels = await Hotel.find().populate('managerId', 'name email');
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Manager/Admin: Get their own hotels
router.get('/manager', verifyToken, verifyRole(['manager', 'admin']), async (req, res) => {
    try {
        const hotels = await Hotel.find({ managerId: req.user._id });
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single hotel details
router.get('/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        const rooms = await Room.find({ hotelId: req.params.id });
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
        res.json({ hotel, rooms });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Manager/Admin: Create hotel
router.post('/', verifyToken, verifyRole(['manager', 'admin']), async (req, res) => {
    try {
        const hotel = new Hotel({
            ...req.body,
            managerId: req.user._id
        });
        await hotel.save();
        res.status(201).json(hotel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Manager/Admin: Update hotel
router.put('/:id', verifyToken, verifyRole(['manager', 'admin']), async (req, res) => {
    try {
        const hotel = await Hotel.findOneAndUpdate(
            { _id: req.params.id, managerId: req.user._id },
            req.body,
            { new: true }
        );
        if (!hotel) return res.status(404).json({ message: 'Hotel not found or unauthorized' });
        res.json(hotel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Admin: Approve/Reject Hotel
router.patch('/:id/approve', verifyToken, verifyRole(['admin']), async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { isApproved: req.body.isApproved },
            { new: true }
        );
        res.json(hotel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Manager: Delete hotel
router.delete('/:id', verifyToken, verifyRole(['manager', 'admin']), async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ _id: req.params.id });
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
        
        // Ensure manager owns it OR is admin
        if (hotel.managerId.toString() !== req.user._id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Hotel.findByIdAndDelete(req.params.id);
        await Room.deleteMany({ hotelId: req.params.id });
        res.json({ message: 'Hotel and its rooms deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
