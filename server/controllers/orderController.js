const Order = require("../models/Order");
const Item = require("../models/Item");
const SessionManager = require("../utils/SessionManager");

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (User ID required)
const createOrder = async (req, res) => {
  const {
    userId,
    items,
    totalAmount,
    orderType,
    tableNumber,
    couponCode,
    discountAmount,
    grossTotal,
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }
  if (status === "Completed") {
    await User.findByIdAndUpdate(order.userId, {
      $inc: { visitCount: 1 },
      lastVisitAt: new Date(),
    });
  }

  try {
    // Generate session ID for this order
    const sessionId = SessionManager.getCurrentSessionId(userId);

    // Calculate total preparation time (Max of all items)
    let maxPrepTime = 15; // default

    if (items && items.length > 0) {
      const itemIds = items.map((i) => i.itemId);
      const dbItems = await Item.find({ _id: { $in: itemIds } });

      if (dbItems.length > 0) {
        const prepTimes = dbItems.map((item) => item.preparationTime || 15);
        maxPrepTime = Math.max(...prepTimes);
      }
    }

    const order = new Order({
      userId,
      sessionId,
      items,
      totalAmount,
      grossTotal,
      couponCode,
      discountAmount,
      orderType,
      tableNumber,
      status: "Pending",
      completionConfig: {
        countDownSeconds: maxPrepTime * 60,
      },
    });

    const createdOrder = await order.save();

    // Emit real-time notification to admin/kitchen with grouped session data
    if (req.io) {
      // Fetch all orders in this session for grouped display
      const sessionOrders = await Order.find({ sessionId })
        .populate("userId", "name mobile")
        .sort({ createdAt: 1 });

      req.io.emit("sessionOrderUpdate", {
        sessionId,
        orders: sessionOrders,
      });
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
    const order = await Order.findById(req.params.id).populate(
      "userId",
      "name mobile",
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Order Status (Updates entire session)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  const { status, feedbackStatus } = req.body;
  try {
    // Get the order to find its sessionId
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update all orders in the same session
    const updates = {};
    if (status) updates.status = status;
    if (feedbackStatus) updates.feedbackStatus = feedbackStatus;

    await Order.updateMany({ sessionId: order.sessionId }, { $set: updates });

    // Return updated session orders
    const updatedOrders = await Order.find({ sessionId: order.sessionId })
      .populate("userId", "name mobile")
      .sort({ createdAt: 1 });

    res.json(updatedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "name mobile")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get grouped orders by session
// @route   GET /api/orders/grouped
// @access  Admin
const getGroupedOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "name mobile")
      .sort({ createdAt: -1 });

    // Group orders by sessionId
    const grouped = {};
    orders.forEach((order) => {
      const sessionId = order.sessionId;
      if (!grouped[sessionId]) {
        grouped[sessionId] = {
          sessionId,
          userId: order.userId,
          orders: [],
          totalAmount: 0,
          grossTotal: 0,
          discountAmount: 0,
          status: "Completed", // Will be overridden
          orderType: order.orderType,
          tableNumber: order.tableNumber,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        };
      }

      grouped[sessionId].orders.push(order);
      grouped[sessionId].totalAmount += order.totalAmount;
      grouped[sessionId].grossTotal += order.grossTotal || order.totalAmount;
      grouped[sessionId].discountAmount += order.discountAmount || 0;

      // Determine overall status (worst status takes precedence)
      const statusPriority = {
        Pending: 4,
        Preparing: 3,
        Ready: 2,
        Completed: 1,
        Cancelled: 0,
      };
      const currentPriority = statusPriority[grouped[sessionId].status] || 0;
      const orderPriority = statusPriority[order.status] || 0;

      if (orderPriority > currentPriority) {
        grouped[sessionId].status = order.status;
      }

      // Update timestamps to reflect earliest order
      if (new Date(order.createdAt) < new Date(grouped[sessionId].createdAt)) {
        grouped[sessionId].createdAt = order.createdAt;
      }
      if (new Date(order.updatedAt) > new Date(grouped[sessionId].updatedAt)) {
        grouped[sessionId].updatedAt = order.updatedAt;
      }
    });

    // Convert to array and sort by date (most recent first)
    const result = Object.values(grouped).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getOrders,
  getGroupedOrders,
};
