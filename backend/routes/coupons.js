const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { verifyToken } = require('../middleware/auth');

// ─────────────────────────────────────────────
//  VALIDATE COUPON (Publicly Accessible)
//  POST /api/coupons/validate
// ─────────────────────────────────────────────
router.post('/validate', async (req, res) => {
    try {
        const { code } = req.body;
        console.log('🔍 ATTEMPTING COUPON AUTHORIZATION:', code);

        if (!code) {
            return res.status(400).json({ message: 'Coupon code is required.' });
        }

        const coupon = await Coupon.findOne({ 
            code: code.toUpperCase(), 
            isActive: true,
            expiryDate: { $gt: new Date() }
        });

        if (!coupon) {
            console.warn('❌ AUTHORIZATION FAILED: INVALID OR EXPIRED CODE:', code);
            return res.status(404).json({ message: 'EXPIRED OR INVALID AUTHORIZATION CODE.' });
        }

        console.log('✅ AUTHORIZATION SUCCESSFUL:', code, 'DISCOUNT:', coupon.discountPercentage + '%');
        res.json({ 
            success: true, 
            discountPercentage: coupon.discountPercentage,
            description: coupon.description 
        });
    } catch (err) {
        console.error('Coupon Validation Error:', err);
        res.status(500).json({ message: 'Internal server error during validation.' });
    }
});

// ─────────────────────────────────────────────
//  INITIALIZE DEFAULT COUPONS (TEMPORARY DEV ROUTE)
//  POST /api/coupons/seed
// ─────────────────────────────────────────────
router.post('/seed', async (req, res) => {
    try {
        const defaultCoupons = [
            {
                code: 'LUXURY25',
                discountPercentage: 25,
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                description: '25% discount for elite sector stays.'
            },
            {
                code: 'NODE50',
                discountPercentage: 50,
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                description: 'Flash 50% discount for synchronized nodes.'
            },
            {
                code: 'WELCOME10',
                discountPercentage: 10,
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
                description: '10% welcome bonus for new personnel.'
            }
        ];

        for (const c of defaultCoupons) {
            await Coupon.findOneAndUpdate({ code: c.code }, c, { upsert: true });
        }

        res.json({ success: true, message: 'Tactical Coupons have been initialized across the network.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
