import {API_BASE_URL, formatMovieDetails, loadTemplate} from './utils.js';
import {showDetailView} from './views.js';
import { disconnectChat, isGeneralChat } from './chat.js';
import {fetchMovieDetails} from "./api.js";

// Get modal element and its content container
const modal = document.getElementById('movieModal');
const modalContent = modal?.querySelector('.modal-content');


// Show the modal with movie details
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
        const movie = await fetchMovieDetails(movieId);
        const template = await loadTemplate('modal-template');

        if (!template) {
            throw new Error('Could not load modal template');
        }

        modalContent.innerHTML = template(movie);

        // Set up close button event listener
        const closeBtn = modalContent.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', hideModal);
        }

        // Set up detail link event listener
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

                // Show the detail view
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

// Hide the modal and restore scroll
export function hideModal() {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Function to handle clicks on movie cards in search results
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

// Function to initialize event listeners for search results
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

    // Also attach to search grid if it exists
    attachSearchListeners();
}

// Initialize once when DOM is loaded
document.addEventListener('DOMContentLoaded', attachModalListeners);

// Reattach search listeners when advanced search is loaded
/*
export function reattachSearchListeners() {
    attachSearchListeners();
}*/
