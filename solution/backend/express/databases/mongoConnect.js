import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

import mongoose from 'mongoose';
import Reviews from '../models/reviews.js';

// MongoDB connection URL from environment variable or default to local MongoDB
const mongo_url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/MongoDB_TWEB";

// Connect to MongoDB
mongoose.connect(mongo_url)
    .then(() => {
        console.log('Successfully connected to MongoDB');
        // Ensure indexes are created for performance
        Reviews.createIndexes();
    })
    .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
    });
