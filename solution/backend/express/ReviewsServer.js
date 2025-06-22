/**
 * Module dependencies.
 */
import reviewsRouter from './reviews/ReviewsController.js';
import dotenv from 'dotenv';
import express from 'express';
import swaggerSetup from './swagger.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_PATH = process.env.API_BASE_PATH || '/api';

// Middleware to parse JSON
app.use(express.json());

// Swagger setup
swaggerSetup(app, API_BASE_PATH);

// Mounting API routes using the base path
app.use(`${API_BASE_PATH}/reviews`, reviewsRouter);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Reviews API' });
});

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Connecting to MongoDB
// This line imports and executes the mongoConnect.js module,
// which establishes the MongoDB connection without deprecated options.
import './mongoConnect.js';

// Error handling middleware
app.use((err, req, res, _next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).json({ error: { message: err.message || 'Internal Server Error' } });
});

// Start server
app.listen(PORT, () => {
    console.log(`Reviews server listening on http://localhost:${PORT}`);
});