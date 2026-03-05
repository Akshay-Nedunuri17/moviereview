const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('../config/db');

// Load env vars
dotenv.config();

// Connect to database
// connectDB() is async, but we can call it here. 
// Vercel serverless functions need special handling for DB connections to avoid exhausting pools.
let isConnected = false;
const connect = async () => {
    if (isConnected) return;
    await connectDB();
    isConnected = true;
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('../routes/auth');
const movieRoutes = require('../routes/movies');
const reviewRoutes = require('../routes/reviews');

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api', (req, res) => {
    res.send('CineRate API is running on Vercel...');
});

// For Vercel, we export the app instead of calling app.listen()
module.exports = async (req, res) => {
    await connect();
    app(req, res);
};
