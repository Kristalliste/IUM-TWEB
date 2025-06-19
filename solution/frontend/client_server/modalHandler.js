import { fetchMovieDetails } from './api.js';
import { formatMovieData } from './utils.js';

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
        const movie = await fetchMovieDetails(movieId);
        return formatMovieData(movie);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}

function populateModal(movie) {
    if (!movie) return;

    if (detailTitle) detailTitle.textContent = movie.title || 'Unknown Title';
    if (detailPoster) {
        detailPoster.src = movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image';
        detailPoster.alt = `Poster for ${movie.title}`;
    }
    if (detailDescription) detailDescription.textContent = movie.description || 'No description available';
    if (detailRating) detailRating.textContent = movie.rating?.toFixed(1) || 'N/A';
    if (detailOscarIcon) {
        detailOscarIcon.style.display = movie.hasOscar ? 'inline-block' : 'none';
        detailOscarIcon.title = movie.hasOscar ? 'Nominated to the Oscar Awards' : '';
    }
    if (detailLink) {
        detailLink.href = `#${movie.id}`;
        detailLink.textContent = 'View Full Details and Reviews';
    }
}

export function showModal(movieId) {
    if (!modal) return;

    // Show loading state
    if (detailDescription) detailDescription.textContent = 'Loading...';
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    loadMovieDetails(movieId)
        .then(movie => {
            if (movie) {
                populateModal(movie);
            } else {
                if (detailDescription) detailDescription.textContent = 'Error loading movie details';
            }
        })
        .catch(error => {
            console.error('Error showing modal:', error);
            if (detailDescription) detailDescription.textContent = 'Error loading movie details';
        });
}

export function hideModal() {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

export function attachModalListeners() {
    if (!modal || !closeBtn) return;

    // Close modal when clicking X
    closeBtn.addEventListener('click', hideModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });

    // Handle movie card clicks via event delegation
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.movie-card');
        if (card) {
            e.preventDefault();
            const movieId = card.dataset.movieId;
            if (movieId) {
                showModal(movieId);
            }
        }
    });
}

// Initialize once when DOM is loaded
document.addEventListener('DOMContentLoaded', attachModalListeners);