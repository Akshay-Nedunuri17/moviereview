const express = require('express');
const Movie = require('../models/Movie');

const router = express.Router();

// @route   GET /api/movies
// @desc    Get all movies (with optional search and category filters)
router.get('/', async (req, res) => {
    try {
        const { search, category, sort } = req.query;
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        if (category) {
            query.category = { $in: [category] };
        }

        let sortOption = { combinedRating: -1 }; // default sort by rating descending
        if (sort === 'releaseDate') {
            sortOption = { releaseDate: -1 };
        }

        const movies = await Movie.find(query).sort(sortOption).limit(50);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/movies/:id
// @desc    Get single movie by DB ID or TMDb ID
router.get('/:id', async (req, res) => {
    try {
        const isMongoId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
        let movie;

        if (isMongoId) {
            movie = await Movie.findById(req.params.id);
        } else {
            movie = await Movie.findOne({ tmdbId: req.params.id });
        }

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
