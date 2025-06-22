import { API_BASE_URL, toTitleCase, capitalizeDescription } from './utils.js';
import { showDetailView } from './views.js';

const modal = document.getElementById('movieModal');
if (!modal) console.error('Modal element not found');

const closeBtn = modal?.querySelector('.close');
const detailTitle = document.getElementById('detailTitle');
const detailPoster = document.getElementById('detailPoster');
const detailDescription = document.getElementById('detailDescription');
const detailOscarIcon = document.getElementById('detailOscarIcon');
const detailRating = document.getElementById('detailRating');
const detailLink = document.getElementById('detailLink');

async function loadMovieDetails(movieId) {
    try {
        const response = await fetch(`${API_BASE_URL}/movies/${movieId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
        }
        const movie = await response.json();

        // Map backend DTO to frontend format
        return {
            id: movie.id,
            title: toTitleCase(movie.title),
            year: movie.year || 'N/A',
            description: capitalizeDescription(movie.description),
            rating: movie.rating,
            posterUrl: movie.posterUrl,
            hasOscar: movie.hasOscar || false
        };
    } catch (error) {
        console.error("Fetch error:", error);
        return {
            title: "Error Loading Movie",
            description: error.message,
            rating: 0,
            posterUrl: "https://placehold.co/300x450?text=Error+Loading",
            year: 'N/A'
        };
    }
}

function populateModal(movie) {
    if (!movie) {
        console.error('No movie data provided to populateModal');
        return;
    }

    // Safely extract properties with fallbacks
    const movieData = {
        id: movie.id || '',
        title: movie.title || 'Title not available',
        posterUrl: movie.posterUrl || 'https://placehold.co/300x450?text=No+Image',
        description: movie.description || 'No description available',
        year: movie.year || 'N/A',
        rating: movie.rating ? movie.rating.toFixed(1) : 'N/A',
        hasOscar: movie.hasOscar || false
    };

    console.log('Displaying movie:', movieData); // Debug

    // Update DOM elements
    if (detailTitle) detailTitle.textContent = movieData.title;
    if (detailPoster) {
        detailPoster.src = movieData.posterUrl;
        detailPoster.alt = `Poster for ${movieData.title}`;
    }
    if (detailDescription) detailDescription.textContent = movieData.description;
    if (detailRating) detailRating.textContent = movieData.rating;
    if (detailOscarIcon) {
        detailOscarIcon.style.display = movieData.hasOscar ? 'inline-block' : 'none';
        detailOscarIcon.title = movieData.hasOscar ? 'Oscar nominated' : '';
    }
    const detailYear = document.getElementById('detailYear');
    if (detailYear) detailYear.textContent = movieData.year;

    if (detailLink) {
        detailLink.href = '#'; // Kept as hash to prevent page reload
        detailLink.textContent = 'View Full Details and Reviews';
        // Add click handler to show detail view
        detailLink.onclick = (e) => {
            e.preventDefault();
            hideModal();
            // Get the mainView and detailView elements
            const mainView = document.querySelector('main');
            const detailView = document.getElementById('movie-detail-view');
            if (mainView && detailView) {
                showDetailView(movieData.id, mainView, detailView);
            }
        };
    }
    if (detailOscarIcon) {
        if (movie.hasOscar) {
            detailOscarIcon.className = 'bi bi-award'; // Set Bootstrap Icons class
            detailOscarIcon.style.display = 'inline-block';
            detailOscarIcon.style.color = '#f5c518'; // Gold color
            detailOscarIcon.style.marginLeft = '10px';
            detailOscarIcon.style.fontSize = '1.2em';
            detailOscarIcon.title = 'Oscar Winner';
        } else {
            detailOscarIcon.style.display = 'none';
        }
    }

}

export function showModal(movieId) {
    // Validate movie ID before making API call
    if (!movieId || movieId === '0' || isNaN(movieId)) {
        console.error('Invalid movie ID:', movieId);
        return;
    }

    if (!movieId) {
        console.error('No movie ID provided');
        return;
    }
    console.log(movieId);
    if (!modal) return;

    // Show loading state
    if (detailTitle) detailTitle.textContent = 'Loading...';
    if (detailDescription) detailDescription.textContent = 'Loading movie details...';
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    loadMovieDetails(movieId)
        .then(movie => {
            if (movie) {
                populateModal(movie);
            } else {
                if (detailTitle) detailTitle.textContent = 'Error';
                if (detailDescription) detailDescription.textContent = 'Failed to load movie details';}
        })
        .catch(error => {
            console.error('Error showing modal:', error);
            if (detailTitle) detailTitle.textContent = 'Error';
            if (detailDescription) {
                detailDescription.textContent = `Error loading movie details: ${error.message}`;
            }
            if (detailRating) detailRating.textContent = '0.0';
        });

    console.log("Requesting movie ID:", movieId); // Should match IDs from homepage


}

export function hideModal() {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

export function attachModalListeners() {
    if (!modal || !closeBtn) return;

    closeBtn.addEventListener('click', hideModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });

    // Use event delegation on movie grid container
    const movieGrid = document.getElementById('movie-grid');
    if (!movieGrid) return;

    movieGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.movie-card');
        if (card) {
            e.preventDefault();
            const movieId = card.getAttribute('data-movie-id');

            // Validate movie ID
            if (movieId && movieId !== '0' && !isNaN(movieId)) {
                showModal(movieId);
            } else {
                console.error('Invalid movie ID:', movieId);
            }
        }
    });
}

// Initialize once when DOM is loaded
document.addEventListener('DOMContentLoaded', attachModalListeners);
