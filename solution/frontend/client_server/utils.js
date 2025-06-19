// URL del connector server
export const API_BASE_URL = 'http://localhost:4000/api';

// Add debounce function
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Add loading indicator
export function showLoader(container) {
    container.innerHTML = `
        <div class="loader">
            <div class="spinner"></div>
            <p>Caricamento in corso...</p>
        </div>
    `;
}

export function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function(match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}

export function formatMovieData(movie) {
    return {
        id: movie.id || movie.movieId,
        title: movie.title || movie.name,
        year: movie.year || (movie.date ? new Date(movie.date).getFullYear() : 'N/A'),
        posterUrl: movie.posterUrl || movie.link || 'https://via.placeholder.com/300x450?text=No+Image',
        description: movie.description || '',
        rating: movie.rating || 0.0,
        actors: movie.actors || [],
        genres: movie.genres || [],
        language: movie.language || '',
        hasOscar: movie.hasOscar || false
    };
}

// Add new utility functions
export const handleApiError = (error) => {
    console.error('API Error:', error);
    return {
        error: true,
        message: error.message || 'Errore nel server'
    };
};

export const validateResponse = (response) => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const moviesPerPage = 8;