const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, 
    category: { type: String, enum: ['Veg', 'Non-Veg'], required: true },
    rating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
