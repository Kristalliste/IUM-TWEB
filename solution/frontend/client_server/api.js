import { API_BASE_URL } from './utils.js';

export async function fetchMovies() {
    const response = await fetch(`${API_BASE_URL}/movies`);
    return await response.json();
}

export async function fetchMovieDetails(movieId) {
    const response = await fetch(`${API_BASE_URL}/movies/${movieId}/full`);
    return await response.json();
}