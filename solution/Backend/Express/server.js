require('dotenv').config();

/**
 * Module dependencies.
 */
const express = require('express');
const mongoose = require('mongoose');
const swaggerSetup = require('./swagger');
const reviewsRoutes = require('./reviews/ReviewsController');
const Reviews = require('./reviews/Reviews');

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_PATH = process.env.API_BASE_PATH || '/api';
const mongo_url = "mongodb://127.0.0.1:27017/MongoDB_TWEB";

// Middleware to parse JSON
app.use(express.json());

// Swagger setup
swaggerSetup(app, API_BASE_PATH);

// Mounting API routes using the base path
app.use(`${API_BASE_PATH}/reviews`, reviewsRoutes);


// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Reviews API' });
});

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});


// Connecting to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(mongo_url)
    .then(() => {
        console.log('Successfully connected to MongoDB');
        return Reviews.createIndexes();
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB', error);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({ error: { message } });
});

// Starting server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${API_BASE_PATH}`);
});