const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { verifyToken, verifyRole } = require('../middleware/auth');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

// Customer: Get own bookings
router.get('/customer', verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('hotelId', 'name city images')
            .populate('roomTypeId', 'type');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Manager/Admin: Get all bookings for all hotels managed by this user
router.get('/manager', verifyToken, verifyRole(['manager', 'admin']), async (req, res) => {
    try {
        const hotels = await Hotel.find({ managerId: req.user._id });
        const hotelIds = hotels.map(h => h._id);
        
        const bookings = await Booking.find({ hotelId: { $in: hotelIds } })
            .populate('userId', 'name email')
            .populate('hotelId', 'name city')
            .populate('roomTypeId', 'type');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Get all bookings
router.get('/all', verifyToken, verifyRole(['admin']), async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('hotelId', 'name')
            .populate('roomTypeId', 'type');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Customer: Create Booking and Simulate Payment (Simulation Mode)
router.post('/simulate-payment', verifyToken, async (req, res) => {
    try {
        const { hotelId, roomTypeId, checkInDate, checkOutDate, guests, totalAmount } = req.body;

        // Force 100% Success for testing
        const isSuccess = true;

        const newBooking = new Booking({
            userId: req.user._id,
            hotelId,
            roomTypeId,
            checkInDate,
            checkOutDate,
            guests,
            totalAmount,
            paymentStatus: isSuccess ? 'paid' : 'failed',
            bookingStatus: isSuccess ? 'confirmed' : 'cancelled',
            razorpayPaymentId: isSuccess ? `sim_pay_${Date.now()}` : null
        });

        await newBooking.save();
        console.log('--- Booking Success Created: ', newBooking._id);

        res.json({ 
            success: true, 
            message: 'Payment simulation successful', 
            bookingId: newBooking._id 
        });
    } catch (err) {
        console.error('--- Simulation Save Error: ', err);
        res.status(500).json({ message: 'Database registry uplink failed during simulation: ' + err.message });
    }
});

// Cancel Booking / Refund Simulation
router.post('/:id/cancel', verifyToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Authorization check
        if (booking.userId.toString() !== req.user._id && req.user.role !== 'manager' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        // Logic for cancellation
        booking.bookingStatus = 'cancelled';
        
        let message = 'Booking cancelled successfully';
        if (booking.paymentStatus === 'paid') {
            booking.paymentStatus = 'refunded';
            message = 'Booking cancelled and Refund Initiated successfully';
        }

        await booking.save();
        res.json({ message, booking });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
