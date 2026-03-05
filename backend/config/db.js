const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    if (uri && uri.includes('127.0.0.1')) {
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log('Using in-memory MongoDB Server!');
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed mock data
    if (uri && uri.includes('127.0.0.1')) {
      const Movie = require('../models/Movie');
      const count = await Movie.countDocuments();
      if (count === 0) {
        await Movie.create([
          { tmdbId: 1, title: 'Inception', posterPath: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', backdropPath: '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg', overview: 'A thief...', releaseDate: '2010', category: ['trending', 'top_rated'], tmdbRating: 8.8, tmdbVotes: 100 },
          { tmdbId: 2, title: 'Interstellar', posterPath: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', category: ['trending', 'upcoming'], tmdbRating: 8.6, tmdbVotes: 200 }
        ]);
        console.log('Mock movies seeded into memory DB.');
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
