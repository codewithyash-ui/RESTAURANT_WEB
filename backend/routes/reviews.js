// backend/routes/reviews.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Get reviews for a product
router.get('/product/:productId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

// Add review for a product
router.post('/', async (req, res, next) => {
  try {
    const { productId, productName, userId, userName, rating, comment } = req.body;
    
    const review = new Review({
      productId,
      productName,
      userId,
      userName,
      rating,
      comment
    });
    
    await review.save();
    res.status(201).json({ success: true, review });
  } catch (err) {
    next(err);
  }
});

// Get average rating for a product
router.get('/rating/:productId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    res.json({ averageRating: avgRating, totalReviews: reviews.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;