import {capitalizeDescription, escapeHTML, toTitleCase} from './utils.js';
import { renderUsernamePrompt } from './chat.js';
import { fetchMovieDetails } from './api.js';

// Format movie details response to a consistent structure
function formatMovieDetails(movieData) {
    return {
        id: movieData.id,
        title: toTitleCase(movieData.title),
        year: movieData.year,
        posterUrl: movieData.posterUrl || 'https://placehold.co/300x450?text=No+Image',
        description: capitalizeDescription(movieData.description),
        rating: movieData.rating || 0, // Ensure rating defaults to 0
        actors: movieData.actors || [],
        genres: movieData.genres || [],
        languages: movieData.languages || [],
        hasOscar: movieData.hasOscar || false,
        reviews: movieData.reviews?.map(review => ({
            user: review.critic_name || 'Anonimo',
            comment: review.review_text || ''
        })) || []
    };
}

export function showMainView(mainView, detailView) {
    mainView.style.display = 'block';
    detailView.style.display = 'none';
    detailView.innerHTML = '';
}

// Function to show the film details view
export async function showDetailView(movieId, mainView, detailView) {
    mainView.style.display = 'none';
    detailView.style.display = 'block';
    window.scrollTo(0, 0);

    detailView.innerHTML = `
        <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading details...</p>
        </div>
    `;

    try {
        const movieData = await fetchMovieDetails(movieId);
        const movie = formatMovieDetails(movieData);

        detailView.innerHTML = `
    <div class="container">
        <button id="back-button" class="back-button"><i class="fas fa-arrow-left"></i> Return to Movie List </button>
        <div id="MovieDetailsPage" class="detail-grid">
             <div class="detail-poster">
                 <img src="${movie.posterUrl}" alt=" ${movie.title} poster">
             </div>
            
            <div class="detail-info">
            <h1>${escapeHTML(movie.title)} 
                ${movie.hasOscar ? `<span id="detailOscarIcon" class="bi bi-award" title="Nominated to the Oscar Awards"></span>` : ''}
                <span class="year">(${movie.year})</span>
            </h1>
          
            <div class="detail-rating">
                <i class="fas fa-star icon-star"></i>
                <span>${movie.rating.toFixed(1) ?? 'N/A'}</span>
            </div>
          
            <p class="description">${escapeHTML(movie.description)}</p>
          
            <div class="detail-list-container">
                <div class="languages-section">
                    <h3 class="detail-section-header">Languages</h3>
                    <ul class="languages-list">
                        ${(movie.languages || []).map(lang =>
            `<li class="detail-list-item">${escapeHTML(lang)}</li>`
        ).join('') || '<li class="detail-list-item">No languages specified</li>'}
                    </ul>
                </div>
   
                <div class="genres-section">
                    <h3 class="detail-section-header">Genres</h3>
                    <ul class="genres-list">
                        ${(movie.genres || []).map(genre =>
            `<li class="detail-list-item">${escapeHTML(genre)}</li>`
        ).join('') || '<li class="detail-list-item">No genres specified</li>'}
                    </ul>
                </div>
            
                <div class="actors-section">
                    <h3 class="detail-section-header">Cast</h3>
                    <ul class="actors-list">
                        ${(movie.actors || []).map(actor =>
            `<li class="detail-list-item">${escapeHTML(actor)}</li>`
        ).join('') || '<li class="detail-list-item">No cast specified</li>'}
                    </ul>
                </div>
            </div>
        </div>

        <div class="detail-sections-container">
            <div class="chat-section">
            <h2>Chat Live</h2>
                <div id="chat-wrapper">
                <!-- Chat content will be rendered here -->
                </div>
            </div>
        
            <div class="reviews-section">
            <h3>Reviews</h3>
                <div id="reviews-list" class="reviews-list">
                    ${movie.reviews.length > 0 ? movie.reviews.map(review => `
                        <div class="review-item">
                            <p><strong>${escapeHTML(review.user)}</strong></p>
                            <p>"${escapeHTML(review.comment)}"</p>
                        </div>
                    `).join('') : '<p>No reviews yet.</p>'}
                </div>
            </div>
        </div>
        `;

        document.getElementById('back-button').addEventListener('click', () =>
            showMainView(mainView, detailView)
        );

        const chatWrapper = document.getElementById('chat-wrapper');
        const movieIdSlug = movie.title.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        renderUsernamePrompt(chatWrapper, movie.title, movieIdSlug);

    } catch (error) {
        console.error('Error with loading film details:', error);
        detailView.innerHTML = `
      <button id="back-button" class="back-button"><i class="fas fa-arrow-left"></i> Return to Movie List </button>
      <div class="error-container">
        <i class="fas fa-exclamation-triangle"></i>
        <h2>Error while loading film detail </h2>
        <p>Please try again later</p>
        <p class="error-details">${error.message}</p>
      </div>
    `;

        document.getElementById('back-button').addEventListener('click', () =>
            showMainView(mainView, detailView)
        );
    }
}

// function to render movie cards (now receives pre-paginated movies)
export function renderMovies(movieList, movieGrid, mainView, detailView) {
    movieGrid.innerHTML = '';

    if (!movieList || movieList.length === 0) {
        movieGrid.innerHTML = `
            <p class="no-results" style="color: #888; grid-column: 1 / -1; text-align: center;">
                No film found.
            </p>
        `;
        return;
    }

    movieList.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.setAttribute('data-movie-id', movie.id);

        // Handle missing data gracefully
        const title = movie.title ? escapeHTML(movie.title) : 'Untitled Movie';
        const year = movie.year || 'N/A';
        const rating = movie.rating ? movie.rating.toFixed(1) : 'N/A';
        const description = movie.description ?
            escapeHTML(movie.description) :
            'No description available';
        const posterUrl = movie.posterUrl ||
            'https://placehold.co/300x450?text=No+Image';

        movieCard.innerHTML = `
            <div class="movie-poster-container">
                <img src="${posterUrl}" alt="${title} poster" 
                    onerror="this.src='https://placehold.co/300x450?text=No+Image'" 
                    loading="lazy">
                <div class="movie-overlay">
                    <p class="movie-description">${description}</p>
                </div>
            </div>
            <div class="movie-info">
                <h3>${title} (${year})</h3>
                <div class="movie-rating">
                    <i class="fas fa-star icon-star"></i>
                    <span>${rating}</span>
                </div>
            </div>
        `;

        movieGrid.appendChild(movieCard);
    });
}