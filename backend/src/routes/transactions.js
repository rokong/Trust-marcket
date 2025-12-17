const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// User's own transaction history
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ buyerId: req.user.id }, { sellerId: req.user.id }]
    }).populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .populate('postId', 'title price');
    
    res.json(orders);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching transactions', error: err.message });
  }
});

module.exports = router;
 