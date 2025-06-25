import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

import mongoose from 'mongoose';
import Reviews from './reviews/Reviews.js';

const mongo_url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/MongoDB_TWEB";

async function connectToMongoDB() {
    try {
        // Connect to MongoDB using Mongoose
        await mongoose.connect(mongo_url);

        console.log('Successfully connected to MongoDB');

        // Ensure indexes are created for performance
        await Reviews.createIndexes();

    } catch (error) {
        // Log connection errors and exit process
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
}

// Start the connection process
connectToMongoDB();

export default mongoose;