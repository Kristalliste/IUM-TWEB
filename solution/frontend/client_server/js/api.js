import {API_BASE_URL} from './utils.js';

// Fetches details for a specific movie by its ID
export async function fetchMovieDetails(movieId) {
    const response = await fetch(`${API_BASE_URL}/movies/${movieId}`);
    if (!response.ok) throw new Error('Failed to fetch movie details');
    return await response.json();
}

// Fetches reviews for a movie by its title
export async function fetchMovieReviews(movieTitle) {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews/movies/${encodeURIComponent(movieTitle)}`);

        if (!response.ok) {
            // Handle HTTP errors (e.g., 404 Not Found, 500 Internal Server Error)
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const movieDetail = await response.json();

        // Ensure reviews is always an array
        if (!movieDetail.reviews || !Array.isArray(movieDetail.reviews)) {
            movieDetail.reviews = [];
        }

        return movieDetail;
    } catch (error) {
        // Log error and return an empty reviews array on failure
        console.error(`Error fetching movie details for ID ${movieId}:`, error);
        return {reviews: []};
    }
}
