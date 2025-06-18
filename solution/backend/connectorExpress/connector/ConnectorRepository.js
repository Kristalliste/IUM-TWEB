import axios from 'axios';
import NodeCache from 'node-cache';

const MONGO_API = process.env.MONGO_SERVER_URL || 'http://localhost:3000';
const SPRING_API = process.env.SPRING_SERVER_URL || 'http://localhost:8080';

// Create cache instance
const cache = new NodeCache({ stdTTL: 300 });

const fetchMovieById = async (id) => {
    try {
        const response = await axios.get(`${SPRING_API}/api/movies/${id}`, { timeout: 5000 });
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

const fetchAllMovies = async () => {
    const cacheKey = 'allMovies';
    const cachedMovies = cache.get(cacheKey);

    if (cachedMovies) {
        console.log('Returning cached movies');
        return cachedMovies;
    }

    try {
        const url = `${SPRING_API}/api/movies?size=1000`;
        console.log(`Fetching movies from: ${url}`);

        const response = await axios.get(url);
        console.log(`Response status: ${response.status}`);
        console.log(`Movies count: ${response.data.content.length}`);

        const movies = response.data.content;

        // AGGIUNTO posterUrl e risolto il campo rating
        const transformedMovies = movies.map(movie => ({
            id: movie.movieId,
            title: movie.name,
            year: new Date(movie.date).getFullYear(),
            posterUrl: movie.link, // Aggiunto campo posterUrl
            description: movie.description,
            minute: movie.minute,
            rating: movie.rating || 0.0 // Risolto problema rating null
        }));

        cache.set(cacheKey, transformedMovies);
        return transformedMovies;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
};

export default {
    fetchMovieById,
    fetchReviewsByMovieId,
    fetchMovieWithReviews,
    fetchAllMovies
};