/**
 * Module dependencies.
 */
import express from 'express';
import dotenv from 'dotenv';
import swaggerSetup from './swagger.js';
import allRoutes from './routes/index.js'; // THIS IS THE CORRECT IMPORT FOR THE ROUTES INDEX
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const API_BASE_PATH = process.env.API_BASE_PATH || '/api';

app.use(cors());

// JSON parser
app.use(express.json());

// Swagger setup
swaggerSetup(app, API_BASE_PATH);

// Routes
app.use(`${API_BASE_PATH}`, allRoutes); // Use the consolidated router from routes/index.js

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Connector API is running' });
});

// 404 Not Found handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, _next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).json({ error: { message: err.message || 'Internal Server Error' } });
});

export default app; // Export the app for bin/www
