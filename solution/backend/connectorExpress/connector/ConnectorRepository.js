const axios = require('axios');
const MONGO_API = process.env.MONGO_SERVER_URL;
const SPRING_API = process.env.SPRING_SERVER_URL;

//temporary queries

const fetchAllReviews = async () => {
    try {
        const response = await axios.get(MONGO_API);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch reviews: ${error.message}`);
    }
};

const fetchAllMovies = async () => {
    try {
        const response = await axios.get(SPRING_API);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch movies: ${error.message}`);
    }
};

module.exports = {
    fetchAllReviews,
    fetchAllMovies,
};
