require('dotenv').config();
const mongoose = require('mongoose');
const Reviews = require('./reviews/Reviews'); // Only if you need to create indexes

const mongo_url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/MongoDB_TWEB";

async function connectToMongoDB() {
    try {
        await mongoose.connect(mongo_url);

        console.log('Successfully connected to MongoDB');

        await Reviews.createIndexes(); // Ensure indexes are created for performance

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1); // Exit with failure
    }
}

// Connect immediately when this module is imported
connectToMongoDB();

// Export connection or function for re-use
module.exports = mongoose;
