import axios from 'axios';

const MONGO_API = process.env.MONGO_SERVER_URL;
const SPRING_API = process.env.SPRING_SERVER_URL;

const fetchMovieById = async (id) => {
    try {
        const response = await axios.get(`${SPRING_API}/movies/${id}`, { timeout: 5000 });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Server responded with ${error.response.status}`);
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('Request setup error');
        }
    }
};

const fetchReviewsByMovieId = async (movieId) => {
    try {
        const response = await axios.get(`${MONGO_API}/reviews?movieId=${movieId}`, { timeout: 5000 });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Server responded with ${error.response.status}`);
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('Request setup error');
        }
    }
};

const fetchMovieWithReviews = async (movieId) => {
    try {
        const [movie, reviews] = await Promise.all([
            fetchMovieById(movieId),
            fetchReviewsByMovieId(movieId)
        ]);

        return {
            ...movie,
            reviews,
            reviewCount: reviews.length
        };
    } catch (error) {
        if (error.response) {
            throw new Error(`Server responded with ${error.response.status}`);
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('Request setup error');
        }
    }
};

export default {
    fetchMovieById,
    fetchReviewsByMovieId,
    fetchMovieWithReviews
};