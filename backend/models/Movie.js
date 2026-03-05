const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    tmdbId: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    posterPath: String,
    backdropPath: String,
    overview: String,
    releaseDate: String,
    genreIds: [Number],
    tmdbRating: {
        type: Number,
        default: 0,
    },
    tmdbVotes: {
        type: Number,
        default: 0,
    },
    userRating: {
        type: Number,
        default: 0,
    },
    userVotes: {
        type: Number,
        default: 0,
    },
    combinedRating: {
        type: Number,
        default: function () {
            // Calculate combined rating based on tmdb and user rating
            const totalVotes = this.tmdbVotes + this.userVotes;
            if (totalVotes === 0) return 0;
            return ((this.tmdbRating * this.tmdbVotes) + (this.userRating * this.userVotes)) / totalVotes;
        }
    },
    category: {
        type: [String], // trending, top_rated, upcoming
        default: [],
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

// Middleware to calculate combinedrating before save
movieSchema.pre('save', function () {
    const totalVotes = this.tmdbVotes + this.userVotes;
    if (totalVotes === 0) {
        this.combinedRating = 0;
    } else {
        this.combinedRating = ((this.tmdbRating * this.tmdbVotes) + (this.userRating * this.userVotes)) / totalVotes;
    }
});

module.exports = mongoose.model('Movie', movieSchema);
