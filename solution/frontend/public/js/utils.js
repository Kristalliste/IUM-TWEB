// Connector server URL
export const API_BASE_URL = 'http://localhost:4000/api';
export const moviesPerPage = 10;

// Add debounce function
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Function to format movie data for main view
export function formatMovieData(movie) {
    return {
        id: movie.id,
        title: movie.title ? toTitleCase(movie.title) : 'Untitled Movie',
        year: movie.year || (movie.date ? new Date(movie.date).getUTCFullYear() : 0),
        posterUrl: movie.posterUrl || movie.link || 'https://placehold.co/300x450?text=No+Image',
        description: capitalizeDescription(movie.description),
        rating: movie.rating || 'N/A',
        minute: movie.minute || 0,
        hasOscar: movie.hasOscar || false,
    };
}

// Function to format movie data for details view
export function formatMovieDetails(movieData) {
    return {
        id: movieData.id,
        title: toTitleCase(movieData.title) || 'Unknown',
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

// Format movie reviews response to a consistent structure
export function formatMovieReviews(movieReviewsData) {
    return {
        reviews: movieReviewsData.map(review => ({
            critic_name: review.critic_name || 'Anonymous',
            top_critic: review.top_critic || false,
            review_date: review.review_date || '',
            review_content: review.review_content || "The critic didn't leave any comment.",
            normalized_score: review.normalized_score || 'N/A'
        }))
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

// Function to correctly display movie titles
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

// Function to correctly display movie descriptions
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

/**
 * Loads and compiles a Handlebars template asynchronously.
 * @param {string} templateName - The name of the template file (without extension)
 * @returns {Promise<Function|null>} - The compiled template function or null if loading fails
 */
export async function loadTemplate(templateName) {
    try {
        // Fetch the handlebars file
        const response = await axios.get(`../../views/${templateName}.hbs`);
        const templateText = response.data;

        // Compile it with Handlebars
        return Handlebars.compile(templateText);
    } catch (error) {
        // Log error and return null if loading fails
        console.error(`Error loading template: ${templateName}`, error);
        return null;
    }
}