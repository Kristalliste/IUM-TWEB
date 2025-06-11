/**
 * Module dependencies.
 */
const express = require('express');
const mongoose = require('mongoose');
const swaggerSetup = require('./swagger');
const reviewsRoutes = require('./reviews/ReviewsController');
const Reviews = require('./reviews/Reviews');

const app = express();
const url = "mongodb://127.0.0.1:27017/MongoDB_TWEB";

// Middleware to parse JSON
app.use(express.json());

// Setup Swagger
swaggerSetup(app);

// Mount API routes
app.use('/api', reviewsRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Reviews API' });
});

// Fallback for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(url)
    .then(() => {
        console.log('Successfully connected to MongoDB');
        return Reviews.createIndexes();
    })
    .then(() => {
        console.log('Indexes created successfully');
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB', error);
    });

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
