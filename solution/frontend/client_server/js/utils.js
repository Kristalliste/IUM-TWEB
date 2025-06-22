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

export function toTitleCase(str) {
    if (!str) return ''; // Handle undefined/null
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function capitalizeDescription(str) {
    if (!str) return '';
    return str
        .split('.')
        .map(sentence => {
            const trimmed = sentence.trim();
            if (!trimmed) return ''; // Skip empty sentences

            // Capitalize first letter and add period if missing
            const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
            return capitalized.endsWith('.') ? capitalized : capitalized + '.';
        })
        .filter(sentence => sentence) // Remove any empty strings
        .join(' ')
        .trim();
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

export const moviesPerPage = 10;