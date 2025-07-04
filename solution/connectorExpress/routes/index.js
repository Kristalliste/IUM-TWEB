import express from 'express';
import connectorRoutes from './connector.js'; // Import your connector routes

const router = express.Router();

// Use the connector routes under the root path
router.use('/', connectorRoutes);

export default router;
