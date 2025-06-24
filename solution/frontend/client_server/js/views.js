import {capitalizeDescription, escapeHTML, toTitleCase} from './utils.js';
import { renderUsernamePrompt } from './chat.js';
import { fetchMovieDetails, fetchMovieReviews } from './api.js';
import { loadTemplate } from './templateLoader.js';
import { initSearch } from './searchMain.js'; // <--- ADD THIS IMPORT

// Format movie details response to a consistent structure
function formatMovieDetails(movieData) {
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

// Format movie reviews response to a consistent structure
function formatMovieReviews(movieReviewsData) {
    return {
        reviews: movieReviewsData.map(review => ({
            critic_name: review.criticName || 'Anonymous',
            top_critic: review.topCritic || false,
            review_date: review.reviewDate || '',
            review_content: review.reviewContent || "The critic didn't leave any comment.",
            normalized_score: review.normalizedScore || 'N/A'
        }))
    };
}

// Function to fetch the HTML template for movie details view
/*async function fetchMovieDetailTemplate() {
    const response = await fetch('./movieDetail.html');
    if (!response.ok) {
        throw new Error('Failed to load movie detail template');
    }
    return response.text();
}*/

// Function to show the film details view
export function showMainView(mainView, detailView) {
    mainView.style.display = 'block';
    detailView.style.display = 'none';
    detailView.innerHTML = '';
}

// views.js - update the showAdvancedSearch function
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
        console.log("Reviews data passed to template:", formattedReviews); // <-- Add this line


        const detailTemplate = await loadTemplate('movie-detail');

        if (!detailTemplate) throw new Error('Could not load detail template');

        // Prepare data for template
        const templateData = {
            ...formattedMovie,
            reviews: formattedReviews
        };

        // Render with Handlebars
        detailView.innerHTML = detailTemplate(templateData);


        //DA METTERE IN HANDLEBARS
       /* const actorsList = document.getElementById('detail-view-actors-list');
        actorsList.innerHTML = (movie.actors || [])
            .map(actor => `
        <li class="detail-list-item">
            <strong>${escapeHTML(actor.name)}</strong> [ ${escapeHTML(actor.role)} ]
        </li>`
            )
            .join('') || '<li class="detail-list-item">No cast specified</li>';
*/
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

// Function to render movie cards (now receives pre-paginated movies)
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
        console.log("renderMovies: Generated HTML for movie:", html.substring(0, 200) + '...'); // Log a snippet for brevity
        movieGrid.insertAdjacentHTML('beforeend', html);
    });
    console.log("renderMovies: FINAL check - movieGrid.innerHTML:", movieGrid.innerHTML);
}