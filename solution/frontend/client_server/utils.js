export const API_BASE_URL = 'http://localhost:4000/api'; // URL del connector server

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