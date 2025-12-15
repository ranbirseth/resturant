const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// @desc    Validate a coupon
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = async (req, res) => {
    const { code, cartTotal } = req.body;

    try {
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid or expired coupon code' });
        }

        if (cartTotal < coupon.minOrderAmount) {
            return res.status(400).json({ 
                message: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon` 
            });
        }

        let discountAmount = 0;
        if (coupon.discountType === 'PERCENT') {
            discountAmount = (cartTotal * coupon.value) / 100;
        } else if (coupon.discountType === 'FLAT') {
            discountAmount = coupon.value;
        }

        // Ensure discount doesn't exceed cart total
        if (discountAmount > cartTotal) {
            discountAmount = cartTotal;
        }

        res.json({
            success: true,
            code: coupon.code,
            discountType: coupon.discountType,
            value: coupon.value,
            discountAmount,
            message: 'Coupon applied successfully!'
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all active coupons
// @route   GET /api/coupons
// @access  Public
const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({ isActive: true }).select('code discountType value minOrderAmount');
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Seed initial coupons (For Demo)
// @route   POST /api/coupons/seed
const seedCoupons = async (req, res) => {
    try {
        await Coupon.deleteMany({});
        const coupons = [
            { code: 'WELCOME10', discountType: 'PERCENT', value: 10, minOrderAmount: 200 },
            { code: 'SAVE50', discountType: 'FLAT', value: 50, minOrderAmount: 300 },
            { code: 'ZINK20', discountType: 'PERCENT', value: 20, minOrderAmount: 500 }
        ];
        await Coupon.insertMany(coupons);
        res.json({ message: 'Coupons seeded' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

router.post('/validate', validateCoupon);
router.get('/', getCoupons);
router.post('/seed', seedCoupons);

module.exports = router;
