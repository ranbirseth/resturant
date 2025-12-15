const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (User ID required)
const createOrder = async (req, res) => {
    const { userId, items, totalAmount, orderType, tableNumber, couponCode, discountAmount, grossTotal } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    try {
        const order = new Order({
            userId,
            items,
            totalAmount,
            grossTotal,
            couponCode,
            discountAmount,
            orderType,
            tableNumber,
            status: 'Pending'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId', 'name mobile');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Order Status (Simulate Admin / Kitchen)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
    const { status, feedbackStatus } = req.body;
    try {
        const updates = {};
        if (status) updates.status = status;
        if (feedbackStatus) updates.feedbackStatus = feedbackStatus;

        const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
        
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getOrderById, updateOrderStatus };
