import {API_BASE_URL, formatMovieDetails} from './utils.js';
import { showDetailView } from './views.js';
import { loadTemplate } from './templateLoader.js';
import { disconnectChat, isGeneralChat } from './chat.js';

const modal = document.getElementById('movieModal');
const modalContent = modal?.querySelector('.modal-content');

async function loadMovieDetails(movieId) {
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

export function attachModalListeners() {
    if (!modal) return;

    // Use event delegation on movie grid container
    const movieGrid = document.getElementById('movie-grid');
    if (movieGrid) {
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
}

// Initialize once when DOM is loaded
document.addEventListener('DOMContentLoaded', attachModalListeners);
