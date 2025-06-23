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
        // This is typically done once or on model definition.
        await Reviews.createIndexes();

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1); // Exit with failure
    }
}

// Connect immediately when this module is imported
connectToMongoDB();

// Export mongoose instance for re-use if needed by other modules
export default mongoose;
