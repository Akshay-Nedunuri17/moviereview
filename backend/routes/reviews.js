const express = require('express');
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reviews
// @desc    Add a review for a movie
router.post('/', protect, async (req, res) => {
    try {
        const { movieId, rating, comment } = req.body;

        const movie = await Movie.findById(movieId);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        // Check if user already reviewed
        const existingReview = await Review.findOne({ user: req.user._id, movie: movieId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this movie' });
        }

        const review = await Review.create({
            user: req.user._id,
            movie: movieId,
            rating: Number(rating),
            comment
        });

        // Update movie user rating
        movie.userRating = ((movie.userRating * movie.userVotes) + Number(rating)) / (movie.userVotes + 1);
        movie.userVotes += 1;
        await movie.save();

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/reviews/movie/:movieId
// @desc    Get reviews for a movie
router.get('/movie/:movieId', async (req, res) => {
    try {
        const reviews = await Review.find({ movie: req.params.movieId }).populate('user', 'username').sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
