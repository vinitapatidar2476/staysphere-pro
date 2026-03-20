const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Get all rooms for a hotel
router.get('/hotel/:hotelId', async (req, res) => {
    try {
        const rooms = await Room.find({ hotelId: req.params.hotelId });
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Manager: Create Room
router.post('/', verifyToken, verifyRole(['manager']), async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ _id: req.body.hotelId, managerId: req.user._id });
        if (!hotel) return res.status(403).json({ message: 'Unauthorized to add room to this hotel' });

        const room = new Room(req.body);
        await room.save();
        
        // Update hotel minPrice
        const allRooms = await Room.find({ hotelId: req.body.hotelId });
        const minPrice = Math.min(...allRooms.map(r => r.price));
        await Hotel.findByIdAndUpdate(req.body.hotelId, { minPrice });

        res.status(201).json(room);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Manager: Update Room
router.put('/:id', verifyToken, verifyRole(['manager']), async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        const hotel = await Hotel.findOne({ _id: room.hotelId, managerId: req.user._id });
        if (!hotel) return res.status(403).json({ message: 'Unauthorized' });

        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        // Update hotel minPrice
        const allRooms = await Room.find({ hotelId: room.hotelId });
        const minPrice = Math.min(...allRooms.map(r => r.price));
        await Hotel.findByIdAndUpdate(room.hotelId, { minPrice });

        res.json(updatedRoom);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Manager: Delete Room
router.delete('/:id', verifyToken, verifyRole(['manager']), async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        const hotel = await Hotel.findOne({ _id: room.hotelId, managerId: req.user._id });
        if (!hotel) return res.status(403).json({ message: 'Unauthorized' });

        await Room.findByIdAndDelete(req.params.id);
        res.json({ message: 'Room deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
