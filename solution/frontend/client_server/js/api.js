import {API_BASE_URL} from './utils.js';

export async function fetchMovieDetails(movieId) {
    const response = await fetch(`${API_BASE_URL}/movies/${movieId}`);
    if (!response.ok) throw new Error('Failed to fetch movie details');
    return await response.json();
}

export async function fetchMovieReviews(movieTitle) {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews/movies/${encodeURIComponent(movieTitle)}`);

        if (!response.ok) {
            // Handle HTTP errors (e.g., 404 Not Found, 500 Internal Server Error)
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const movieDetail = await response.json();

        if (!movieDetail.reviews || !Array.isArray(movieDetail.reviews)) {
            movieDetail.reviews = [];
        }

        return movieDetail;
    } catch (error) {
        console.error(`Error fetching movie details for ID ${movieId}:`, error);
        return {reviews: []};
    }
}
