import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Reviews from './reviews/Reviews.js';

const mongo_url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/MongoDB_TWEB";

async function connectToMongoDB() {
    try {
        await mongoose.connect(mongo_url);

        console.log('Successfully connected to MongoDB');

        // Ensure indexes are created for performance
        await Reviews.createIndexes();

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
}

connectToMongoDB();

export default mongoose;
