const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Hotel = require('../models/Hotel');
const { verifyToken } = require('../middleware/auth');

// Get all reviews for a hotel
router.get('/:hotelId', async (req, res) => {
    try {
        const reviews = await Review.find({ hotelId: req.params.hotelId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Post a review (Authenticated Customers)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { hotelId, rating, comment } = req.body;
        const review = new Review({
            hotelId,
            userId: req.user._id,
            userName: req.user.name || 'Anonymous User',
            rating,
            comment
        });
        await review.save();
        
        // Update hotel average rating and count
        const allReviews = await Review.find({ hotelId });
        const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
        
        await Hotel.findByIdAndUpdate(hotelId, {
            avgRating: parseFloat(avgRating.toFixed(1)),
            totalReviews: allReviews.length
        });
        
        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
