const cron = require('node-cron');
const Movie = require('../models/Movie');
const tmdbService = require('../services/tmdb');

// Run every 24 hours at midnight
const startSyncJob = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('Starting daily ratings sync...');
        try {
            const movies = await Movie.find({});
            for (let movie of movies) {
                // In a real app we would want to rate limit these calls
                try {
                    const tmdbData = await tmdbService.getMovieDetails(movie.tmdbId);
                    if (tmdbData) {
                        movie.tmdbRating = tmdbData.vote_average;
                        movie.tmdbVotes = tmdbData.vote_count;
                        movie.lastUpdated = Date.now();
                        await movie.save();
                    }
                } catch (err) {
                    console.error(`Failed to sync movie ${movie.tmdbId}: ${err.message}`);
                }
            }
            console.log('Daily ratings sync completed.');
        } catch (error) {
            console.error('Error in daily ratings sync:', error.message);
        }
    });
    console.log('Ratings sync job scheduled.');
};

module.exports = startSyncJob;
