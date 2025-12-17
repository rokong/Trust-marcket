// backend/src/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['bkash','rocket','nagad','paypal','manual'], required: true },
  status: { type: String, enum: ['pending','paid','verified','completed','cancelled'], default: 'pending' },
  paymentRef: String,
  buyerNote: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
// status: pending → paid → verified → completed → cancelled
