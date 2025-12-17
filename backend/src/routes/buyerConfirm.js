const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Buyer confirms received credentials
router.put('/confirm/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if(!order) return res.status(404).json({ message: 'Order not found' });

    if(order.buyerId.toString() !== req.user.id)
      return res.status(403).json({ message: 'You are not the buyer of this order' });

    if(order.status !== 'verified')
      return res.status(400).json({ message: 'Order is not yet verified by admin' });

    order.status = 'completed';
    await order.save();

    res.json({ message: 'You have confirmed delivery. Seller will receive payment' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Error confirming delivery', error: err.message });
  }
});

module.exports = router;
