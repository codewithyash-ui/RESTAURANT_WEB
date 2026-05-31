// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders (for admin)
router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Create new order
router.post('/', async (req, res, next) => {
  try {
    const { customer, items, totalAmount } = req.body;
    
    if (!customer || !items || !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newOrder = new Order({
      customer,
      items,
      totalAmount,
      paymentMethod: 'dummy',
      status: 'pending'
    });
    
    const savedOrder = await newOrder.save();
    res.status(201).json({ 
      success: true, 
      orderId: savedOrder._id,
      message: 'Order placed successfully!'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;