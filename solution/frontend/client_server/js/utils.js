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
            <p>Loading...</p>
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
    if (!str) return '';

    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const specialWords = ['A', 'An', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];

    return str
        .toLowerCase()
        .split(/(\s+|:|\s+–\s+)/) // Dividi preservando spazi, due punti e trattini
        .map((segment, index, array) => {
            // Gestisci segmenti speciali (due punti, trattini)
            if (segment === ':' || segment === ' – ') {
                return segment;
            }

            // Gestisci numeri romani
            if (romanNumerals.includes(segment.toUpperCase())) {
                return segment.toUpperCase();
            }

            // Gestisci parole dopo due punti o trattini
            const prevSegment = array[index - 1];
            if (prevSegment === ':' || prevSegment === ' – ') {
                return segment.charAt(0).toUpperCase() + segment.slice(1);
            }

            // Gestisci parole comuni (non capitalizzare se non all'inizio)
            if (index > 0 && index < array.length - 1 &&
                specialWords.includes(segment.charAt(0).toUpperCase() + segment.slice(1))) {
                return segment;
            }

            // Capitalizza normalmente
            return segment.charAt(0).toUpperCase() + segment.slice(1);
        })
        .join('');
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
        message: error.message || 'Server Error'
    };
};

export const validateResponse = (response) => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const moviesPerPage = 10;