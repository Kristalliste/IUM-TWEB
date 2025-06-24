import {API_BASE_URL, formatMovieDetails} from './utils.js';
import {showDetailView} from './views.js';
import { loadTemplate } from './templateLoader.js';
import { disconnectChat, isGeneralChat } from './chat.js';

const modal = document.getElementById('movieModal');
const modalContent = modal?.querySelector('.modal-content');

export async function loadMovieDetails(movieId) {
    try {
        const response = await fetch(`${API_BASE_URL}/movies/${movieId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
        }
        const movie = await response.json();

        return formatMovieDetails(movie);
    } catch (error) {
        console.error("Fetch error:", error);
        return {
            title: "Error Loading Movie",
            description: error.message,
            rating: 0,
            posterUrl: "https://placehold.co/300x450?text=Error+Loading",
            year: 'N/A',
            hasOscar: false
        };
    }
}

export async function showModal(movieId) {
    if (!movieId || movieId === '0' || isNaN(movieId)) {
        console.error('Invalid movie ID:', movieId);
        return;
    }
    if (!modal) return;

    // Show loading state
    modalContent.innerHTML = '<div class="loading">Loading movie details...</div>';
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    try {
        const movie = await loadMovieDetails(movieId);
        const template = await loadTemplate('modal-template');

        if (!template) {
            throw new Error('Could not load modal template');
        }

        modalContent.innerHTML = template(movie);

        // Set up event listeners
        const closeBtn = modalContent.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', hideModal);
        }

        const detailLink = document.getElementById('detailLink');
        if (detailLink) {
            detailLink.onclick = (e) => {
                e.preventDefault();
                hideModal();

                // Close main chat when navigating to details views
                const floatingChat = document.getElementById('floating-chat');
                if (floatingChat && !floatingChat.classList.contains('hidden')) {
                    // Disconnect only if it's the general chat
                    if (isGeneralChat()) {
                        disconnectChat();
                    }
                    floatingChat.classList.add('hidden');
                }

                const mainView = document.querySelector('main');
                const detailView = document.getElementById('movie-detail-view');
                if (mainView && detailView) {
                    showDetailView(movie.id, mainView, detailView);
                }
            };
        }

    } catch (error) {
        console.error('Error showing modal:', error);
        modalContent.innerHTML = `<div class="error">Error loading movie details: ${error.message}</div>`;
    }
}

export function hideModal() {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// NEW: Function to handle clicks on movie cards in search results
function handleMovieCardClick(e) {
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
}

// NEW: Function to initialize event listeners for search results
export function attachSearchListeners() {
    const searchGrid = document.getElementById('movie-grid-search');
    if (searchGrid) {
        searchGrid.addEventListener('click', handleMovieCardClick);
    }
}

// Initialize both main and search listeners
export function attachModalListeners() {
    // Main grid listener
    const movieGrid = document.getElementById('movie-grid');
    if (movieGrid) {
        movieGrid.addEventListener('click', handleMovieCardClick);
    }

    // NEW: Also attach to search grid if it exists
    attachSearchListeners();
}

// Initialize once when DOM is loaded
document.addEventListener('DOMContentLoaded', attachModalListeners);

// NEW: Reattach search listeners when advanced search is loaded
export function reattachSearchListeners() {
    attachSearchListeners();
}