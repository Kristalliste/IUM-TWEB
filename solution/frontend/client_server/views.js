import { escapeHTML } from './utils.js';
import { renderUsernamePrompt, renderChatInterface } from './chat.js';
import { fetchMovieDetails } from './api.js';

// Funzione per formattare i dati del backend nel formato frontend
function formatMovieDetails(movieData) {
    return {
        id: movieData.id || movieData.movieId,
        title: movieData.name,
        year: new Date(movieData.date).getFullYear(),
        posterUrl: movieData.link || 'https://via.placeholder.com/300x450?text=No+Image',
        description: movieData.description,
        rating: movieData.rating || 0.0,
        actors: movieData.actors || [],
        genres: movieData.genres || [],
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

export async function showDetailView(movieId, mainView, detailView) {
    // Mostra la vista dettaglio con indicatori di caricamento
    mainView.style.display = 'none';
    detailView.style.display = 'block';
    window.scrollTo(0, 0);

    detailView.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Caricamento dettagli film...</p>
    </div>
  `;

    try {
        // Recupera i dettagli del film dal backend
        const movieData = await fetchMovieDetails(movieId);
        const movie = formatMovieDetails(movieData);

        // Renderizza la vista dettaglio con i dati del film
        detailView.innerHTML = `
      <button id="back-button" class="back-button"><i class="fas fa-arrow-left"></i> Torna alla lista</button>
      <div class="detail-grid">
        <div class="detail-poster">
          <img src="${movie.posterUrl}" alt="Locandina di ${movie.title}">
        </div>
        <div class="detail-info">
          <h1>${escapeHTML(movie.title)} <span class="year">(${movie.year})</span></h1>
          <div class="detail-rating">
            <i class="fas fa-star icon-star"></i>
            <span>${movie.rating.toFixed(1)}</span>
          </div>
          <p class="description">${escapeHTML(movie.description)}</p>
          
          <h3>Attori Principali</h3>
          <ul class="actors-list">
            ${movie.actors.map(actor => `<li>${escapeHTML(actor)}</li>`).join('')}
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
            '<p>Nessuna recensione ancora.</p>'
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

        // Aggiunge l'event listener per il pulsante "Indietro"
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
        console.error('Errore nel caricamento dei dettagli:', error);
        detailView.innerHTML = `
      <button id="back-button" class="back-button"><i class="fas fa-arrow-left"></i> Torna alla lista</button>
      <div class="error-container">
        <i class="fas fa-exclamation-triangle"></i>
        <h2>Errore nel caricamento</h2>
        <p>Impossibile caricare i dettagli del film. Riprova più tardi.</p>
        <p class="error-details">${error.message}</p>
      </div>
    `;

        document.getElementById('back-button').addEventListener('click', () =>
            showMainView(mainView, detailView)
        );
    }
}

export function renderMovies(movieList, movieGrid, currentPage, mainView, detailView) {
    movieGrid.innerHTML = '';

    if (movieList.length === 0) {
        movieGrid.innerHTML = `
      <p class="no-results" style="color: #888; grid-column: 1 / -1; text-align: center;">
        Nessun film trovato.
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

        movieCard.innerHTML = `
      <div class="movie-poster-container">
        <img src="${movie.posterUrl}" alt="Locandina di ${movie.title}" loading="lazy">
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

        movieCard.addEventListener('click', () =>
            showDetailView(movie.id, mainView, detailView)
        );

        movieGrid.appendChild(movieCard);
    });
}