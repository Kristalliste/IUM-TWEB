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

export function formatMovieDetails(movieData) {
    return {
        id: movieData.id,
        title: toTitleCase(movieData.title) || 'Unkonwn',
        originalTitle: movieData.title || 'Unknown', // we keep the original titles to look for its reviews
        year: movieData.year || 0,
        minute: movieData.minute || 0,
        posterUrl: movieData.posterUrl || 'https://placehold.co/300x450?text=No+Image',
        description: capitalizeDescription(movieData.description) || '',
        rating: movieData.rating || 'N/A',
        actors: movieData.actors?.map(a => ({
            name: a.name || 'Unknown actor',
            role: a.role || 'Unknown role'
        })) || [],
        genres: movieData.genres || [],
        languages: movieData.languages || [],
        hasOscar: movieData.hasOscar || false,
    };
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
        .split(/(\s+|:|\s+–\s+)/)
        .map((segment, index, array) => {
            if (segment === ':' || segment === ' – ') {
                return segment;
            }

            if (romanNumerals.includes(segment.toUpperCase())) {
                return segment.toUpperCase();
            }

            const prevSegment = array[index - 1];
            if (prevSegment === ':' || prevSegment === ' – ') {
                return segment.charAt(0).toUpperCase() + segment.slice(1);
            }

            if (index > 0 && index < array.length - 1 &&
                specialWords.includes(segment.charAt(0).toUpperCase() + segment.slice(1))) {
                return segment;
            }

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

export const moviesPerPage = 10;

/**
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



 export function initHandlebars() {
 // Register helper for checking oscar nomination
   Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
 return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
 });

 // Escape HTML helper
  Handlebars.registerHelper('escape', function(context) {
 return escapeHTML(context);
 });
 }
 */
