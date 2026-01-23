const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, updateOrderStatus, getOrders, getGroupedOrders } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/grouped', getGroupedOrders);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
