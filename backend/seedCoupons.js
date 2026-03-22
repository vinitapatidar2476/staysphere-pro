require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const defaultCoupons = [
            {
                code: 'LUXURY25',
                discountPercentage: 25,
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
                description: '25% discount for elite sector stays.'
            },
            {
                code: 'NODE50',
                discountPercentage: 50,
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
                description: 'Flash 50% discount for synchronized nodes.'
            },
            {
                code: 'WELCOME10',
                discountPercentage: 10,
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), 
                description: '10% welcome bonus for new personnel.'
            }
        ];

        for (const c of defaultCoupons) {
            await Coupon.findOneAndUpdate({ code: c.code }, c, { upsert: true });
            console.log(`Seeded coupon: ${c.code}`);
        }

        console.log('Coupons seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
