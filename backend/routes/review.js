// routes/review.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const verifyToken = require('../middleware/authMiddleware');

// Get all reviews (public)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ _id: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Add a new review
router.post('/', verifyToken, async (req, res) => {
  try {
    const { movieTitle, review } = req.body;
    const newReview = new Review({
      movieTitle,
      review,
      email: req.user.email,
    });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: 'Error saving review' });
  }
});

// Like a review
router.post('/:id/like', verifyToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.likes += 1;
    await review.save();
    res.json({ message: 'Like added', likes: review.likes });
  } catch (err) {
    res.status(500).json({ message: 'Error adding like' });
  }
});

// Add a comment
router.post('/:id/comment', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.comments.push({
      text,
      user: req.user.id,
      email: req.user.email,
    });

    await review.save();
    res.json({ message: 'Comment added', comments: review.comments });
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment' });
  }
});

module.exports = router;
