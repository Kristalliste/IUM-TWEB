import {API_BASE_URL, moviesPerPage} from './utils.js';

export async function fetchMovies() {
    const response = await fetch(`${API_BASE_URL}/movies`);
    return await response.json();
}

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

        // **Crucial part:** Ensure 'reviews' is an array, even if the API sends null or undefined
        if (!movieDetail.reviews || !Array.isArray(movieDetail.reviews)) {
            movieDetail.reviews = [];
        }

        return movieDetail; // This 'movieDetail' object is what you'd pass to your Handlebars template
    } catch (error) {
        console.error(`Error fetching movie details for ID ${movieId}:`, error);
        // Depending on your error handling strategy, you might return null or an object with an empty reviews array
        return {reviews: []};
    }
}

export async function fetchMoviesByType(type, page = 0) {
    const response = await fetch(`${API_BASE_URL}/movies/${type}?page=${page}&size=${moviesPerPage}`);
    return await response.json();
}