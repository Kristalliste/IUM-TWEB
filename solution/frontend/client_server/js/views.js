import { formatMovieDetails, formatMovieReviews } from './utils.js';
import { renderUsernamePrompt } from './chat.js';
import { fetchMovieDetails, fetchMovieReviews } from './api.js';
import { loadTemplate } from './templateLoader.js';
import { initSearch } from './searchMain.js';

// Function to show the film details view
export function showMainView(mainView, detailView) {
    mainView.style.display = 'block';
    detailView.style.display = 'none';
    detailView.innerHTML = '';
}

export async function showAdvancedSearch(mainView, detailView) {
    mainView.style.display = 'none';
    detailView.style.display = 'block';
    window.scrollTo(0, 0);

    // Show loading state
    detailView.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading search form...</p>
        </div>
    `;

    try {
        const searchTemplate = await loadTemplate('advanced-search');

        if (!searchTemplate) throw new Error('Could not load search template');

        // Render the template
        detailView.innerHTML = searchTemplate({});

        // Initialize the search functionality
        await initSearch();

        // Set up back button
        const backButton = document.createElement('button');
        backButton.id = 'back-button';
        backButton.className = 'back-button';
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Return to Movie List';
        backButton.addEventListener('click', () => {
            showMainView(mainView, detailView);
        });
        detailView.insertBefore(backButton, detailView.firstChild);

    } catch (error) {
        console.error('Error loading advanced search:', error);
        detailView.innerHTML = `
            <button id="back-button" class="back-button">
                <i class="fas fa-arrow-left"></i> Return to Movie List
            </button>
            <div class="error-container">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Error while loading search form</h2>
                <p>Please try again later</p>
                <p class="error-details">${error.message}</p>
            </div>
        `;

        document.getElementById('back-button').addEventListener('click', () => {
            showMainView(mainView, detailView);
        });
    }
}

export async function showDetailView(movieId, mainView, detailView) {
    mainView.style.display = 'none';
    detailView.style.display = 'block';
    window.scrollTo(0, 0);

    // Show loading state
    detailView.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading details...</p>
        </div>
    `;

    try {
        const movieData = await fetchMovieDetails(movieId);
        const formattedMovie = formatMovieDetails(movieData);

        const movieReviews = await fetchMovieReviews(formattedMovie.originalTitle);
        const formattedReviews = formatMovieReviews(movieReviews);
        console.log("Reviews data passed to template:", formattedReviews);


        const detailTemplate = await loadTemplate('movie-detail');

        if (!detailTemplate) throw new Error('Could not load detail template');

        // Prepare data for template
        const templateData = {
            ...formattedMovie,
            reviews: formattedReviews
        };

        // Render with Handlebars
        detailView.innerHTML = detailTemplate(templateData);

        const toggleChatBtn = document.getElementById('toggle-chat-btn');
        if (toggleChatBtn) {
            toggleChatBtn.addEventListener('click', () => {
                // Scroll to the chat section
                const chatSection = document.querySelector('.chat-section');
                if (chatSection) {
                    chatSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Set up back button
        document.getElementById('back-button').addEventListener('click', () => {
            showMainView(mainView, detailView);
        });

        // Initialize chat
        const chatWrapper = document.getElementById('chat-wrapper');
        const movieIdSlug = formattedMovie.title.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        renderUsernamePrompt(chatWrapper, formattedMovie.title, movieIdSlug);

    } catch (error) {
        console.error('Error loading film details:', error);
        detailView.innerHTML = `
      <button id="back-button" class="back-button">
        <i class="fas fa-arrow-left"></i> Return to Movie List
      </button>
      <div class="error-container">
        <i class="fas fa-exclamation-triangle"></i>
        <h2>Error while loading film details</h2>
        <p>Please try again later</p>
        <p class="error-details">${error.message}</p>
      </div>
    `;

        document.getElementById('back-button').addEventListener('click', () => {
            showMainView(mainView, detailView);
        });
    }
}

// Function to render movie cards ( receives pre-paginated movies)
export async function renderMovies(movieList, movieGrid, mainView, detailView) {
    movieGrid.innerHTML = '';

    if (!movieList || movieList.length === 0) {
        movieGrid.innerHTML = `
      <p class="no-results">No films found</p>
    `;
        return;
    }

    const template = await loadTemplate('movie-card');
    if (!template) return;

    movieList.forEach(movie => {
        const html = template({
            id: movie.id,
            title: movie.title,
            year: movie.year,
            rating: movie.rating,
            description: movie.description,
            posterUrl: movie.posterUrl
        });
        movieGrid.insertAdjacentHTML('beforeend', html);
    });
}