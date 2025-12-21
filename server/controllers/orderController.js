const Order = require('../models/Order');
const Item = require('../models/Item');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (User ID required)
const createOrder = async (req, res) => {
    const { userId, items, totalAmount, orderType, tableNumber, couponCode, discountAmount, grossTotal } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    try {
        // Calculate total preparation time (Max of all items)
        let maxPrepTime = 15; // default

        if (items && items.length > 0) {
            const itemIds = items.map(i => i.itemId);
            const dbItems = await Item.find({ _id: { $in: itemIds } });

            if (dbItems.length > 0) {
                const prepTimes = dbItems.map(item => item.preparationTime || 15);
                maxPrepTime = Math.max(...prepTimes);
            }
        }

        const order = new Order({
            userId,
            items,
            totalAmount,
            grossTotal,
            couponCode,
            discountAmount,
            orderType,
            tableNumber,
            status: 'Pending',
            completionConfig: {
                countDownSeconds: maxPrepTime * 60
            }
        });

        const createdOrder = await order.save();

        // Emit real-time notification to admin/kitchen
        // Using req.io which we attached in server.js
        if (req.io) {
            req.io.emit('newOrder', createdOrder);
        }

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

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('userId', 'name mobile').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getOrderById, updateOrderStatus, getOrders };
