// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movieTitle: { type: String, required: true },
  review: { type: String, required: true },
  email: { type: String },
  likes: { type: Number, default: 0 },
  comments: [
    {
      text: String,
      user: String,
      email: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('Review', reviewSchema);
