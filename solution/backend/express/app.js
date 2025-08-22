/**
 * Module dependencies.
 */
import allRoutes from './routes/index.js'; // Import the main router
import dotenv from 'dotenv';
import express from 'express';
import swaggerSetup from './swagger.js';
import './databases/mongoConnect.js'; // Connecting to MongoDB

dotenv.config();

const app = express();
const API_BASE_PATH = process.env.API_BASE_PATH || '/api';

// Middleware to parse JSON
app.use(express.json());

// Swagger setup
swaggerSetup(app, API_BASE_PATH);

// Mounting all API routes under the base path
app.use(API_BASE_PATH, allRoutes); // Use the imported router

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Reviews API' });
});

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, _next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).json({ error: { message: err.message || 'Internal Server Error' } });
});

// Export the app instance, so it can be imported by www
export default app;
