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
        rating: movieData.rating || 0.,
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

//  Function to show the film details view, reached via 'View Full Details and Reviews' button
export async function showDetailView(movieId, mainView, detailView) {
    // Shows details view
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
        // Fetches movie details from backend
        const movieData = await fetchMovieDetails(movieId);
        const movie = formatMovieDetails(movieData);

        // Renders the details view with movie data
        detailView.innerHTML = `
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
            <span>${movie.rating.toFixed(1)}</span>
          </div>
          <p class="description">${escapeHTML(movie.description)}</p>
          
          <h3>Languages</h3>
            <ul class="languages-list">
            ${movie.languages.map(lang => `<li>${escapeHTML(lang)}</li>`).join('') || '<li>No languages specified</li>'}
             </ul>

          <h3>Genres</h3>
              <ul class="genre-list">
                ${movie.genres.map(genre => `<li>${escapeHTML(genre)}</li>`).join('') || '<li>No genres specified</li>'}
            </ul>

          <h3>Cast</h3>
          <ul class="actors-list">
            ${movie.actors.map(actor => `<li>${escapeHTML(actor)}</li>`).join('') || '<li>No cast specified</li>'}
          </ul>
        </div>
      </div>

      <div class="detail-sections">
        <div class="reviews-section">
          <h2>Recensioni</h2>
          <div id="reviews-list" class="reviews-list">
            ${movie.reviews.length > 0 ?
            movie.reviews.map(review => `
                <div class="review-item">
                  <p><strong>${escapeHTML(review.user)}</strong></p>
                  <p>"${escapeHTML(review.comment)}"</p>
                </div>
              `).join('') :
            '<p>No reviews yet.</p>'/////////////
        }
          </div>
        </div>

        <div class="chat-section">
          <h2>Chat Live</h2>
          <div id="chat-wrapper">
            <!-- Chat content will be rendered here -->
          </div>
        </div>
      </div>
    `;

        // Adds back-button event listener
        document.getElementById('back-button').addEventListener('click', () =>
            showMainView(mainView, detailView)
        );

        // Inizializza la chat
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

// function to render movie cards
export function renderMovies(movieList, movieGrid, currentPage, mainView, detailView) {
    movieGrid.innerHTML = '';

    if (movieList.length === 0) {
        movieGrid.innerHTML = `
      <p class="no-results" style="color: #888; grid-column: 1 / -1; text-align: center;">
        No film found.
      </p>
    `;
        return;
    }

    const startIndex = (currentPage - 1) * 8;
    const endIndex = startIndex + 8;
    const paginatedMovies = movieList.slice(startIndex, endIndex);

    paginatedMovies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.dataset.movieId = movie.id; //addition for modals

        movieCard.innerHTML = `
      <div class="movie-poster-container">
        <img src="${movie.posterUrl}" alt="${movie.title} poster" onerror="this.src='https://placehold.co/300x450?text=No+Image'" loading="lazy">
        <div class="movie-overlay">
          <p class="movie-description">${escapeHTML(movie.description)}</p>
        </div>
      </div>
      <div class="movie-info">
        <h3>${escapeHTML(movie.title)} (${movie.year})</h3>
        <div class="movie-rating">
          <i class="fas fa-star icon-star"></i>
          <span>${movie.rating.toFixed(1)}</span>
        </div>
      </div>
    `;
/**
        movieCard.addEventListener('click', () =>
            showDetailView(movie.id, mainView, detailView)
        );
*/

        movieGrid.appendChild(movieCard);
    });
}