import {API_BASE_URL} from './utils.js';

// Fetches details for a specific movie by its ID
export async function fetchMovieDetails(movieId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies/${movieId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch movie details: ${error.message}`);
    }
}

// Fetches reviews for a movie by its title
export async function fetchMovieReviews(movieTitle) {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/reviews/movies/${encodeURIComponent(movieTitle)}`
        );

        // Ensure reviews is always an array
        if (!response.data.reviews || !Array.isArray(response.data.reviews)) {
            response.data.reviews = [];
        }

        return response.data;
    } catch (error) {
        console.error(`Error fetching movie reviews for "${movieTitle}":`, error);
        return { reviews: [] };
    }
}
