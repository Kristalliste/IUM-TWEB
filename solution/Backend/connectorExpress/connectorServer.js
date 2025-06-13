/**
 * Module dependencies.
 */
require('dotenv').config();
const express = require('express');
const swaggerSetup = require('./swagger');
const connectorRoutes = require('./connector/ConnectorController');

const app = express();
const PORT = process.env.PORT || 4000;
const API_BASE_PATH = process.env.API_BASE_PATH || '/api';

// JSON parser
app.use(express.json());

// Swagger
swaggerSetup(app, API_BASE_PATH);

// Routes
app.use(`${API_BASE_PATH}`, connectorRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Connector API is running' });
});

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, _next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).json({ error: { message: err.message || 'Internal Server Error' } });
});

// Start server
app.listen(PORT, () => {
    console.log(`Connector server listening on http://localhost:${PORT}`);
});
