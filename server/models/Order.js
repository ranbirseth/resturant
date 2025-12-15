const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
            name: String,
            quantity: Number,
            price: Number,
            customizations: [String] // e.g., "Extra cheese", "Extra spicy"
        }
    ],
    totalAmount: { type: Number, required: true }, // This is the Final Payable Amount
    grossTotal: { type: Number }, // Subtotal before discount
    couponCode: { type: String },
    discountAmount: { type: Number, default: 0 },
    orderType: { type: String, enum: ['Dine-in', 'Takeaway'], required: true },
    tableNumber: { type: String }, // Required if Dine-in
    status: { type: String, enum: ['Pending', 'Preparing', 'Ready', 'Completed'], default: 'Pending' },
    feedbackStatus: { 
        type: String, 
        enum: ['Pending', 'Requested', 'Submitted', 'Skipped'], 
        default: 'Pending' 
    },
    completionConfig: {
        countDownSeconds: { type: Number, default: 900 } // 15 mins default
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
