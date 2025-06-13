import { escapeHTML, moviesPerPage } from './utils.js';
import { renderPagination } from './pagination.js';
import { renderUsernamePrompt, renderChatInterface } from './chat.js';

export function showMainView(mainView, detailView) {
    mainView.style.display = 'block';
    detailView.style.display = 'none';
    detailView.innerHTML = '';
}

export function showDetailView(movie, mainView, detailView) {
    mainView.style.display = 'none';
    detailView.style.display = 'block';
    window.scrollTo(0, 0);

    detailView.innerHTML = `
        <button id="back-button" class="back-button"><i class="fas fa-arrow-left"></i> Torna alla lista</button>
        <div class="detail-grid">
            <div class="detail-poster">
                <img src="${movie.posterUrl}" alt="Locandina di ${movie.title}">
            </div>
            <div class="detail-info">
                <h1>${movie.title} <span class="year">(${movie.year})</span></h1>
                <div class="detail-rating">
                    <i class="fas fa-star icon-star"></i>
                    <span>${movie.rating.toFixed(1)}</span>
                </div>
                <p class="description">${movie.description}</p>
                
                <h3>Attori Principali</h3>
                <ul class="actors-list">
                    ${movie.actors.map(actor => `<li>${actor}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="detail-sections">
            <div class="reviews-section">
                <h2>Recensioni</h2>
                <div id="reviews-list" class="reviews-list">
                    ${movie.reviews.length > 0 ? movie.reviews.map(review => `
                        <div class="review-item">
                            <p><strong>${review.user}</strong></p>
                            <p>"${escapeHTML(review.comment)}"</p>
                        </div>
                    `).join('') : '<p>Nessuna recensione ancora.</p>'}
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

    document.getElementById('back-button').addEventListener('click', () => showMainView(mainView, detailView));
    
    const chatWrapper = document.getElementById('chat-wrapper');
    // Usa l'ID del film o genera un slug dal titolo
    const movieId = movie.title.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    renderUsernamePrompt(chatWrapper, movie.title, movieId);
}

export function renderMovies(movieList, movieGrid, currentPage, mainView, detailView) {
    movieGrid.innerHTML = '';
    if (movieList.length === 0) {
        movieGrid.innerHTML = `<p style="color: #888; grid-column: 1 / -1; text-align: center;">Nessun film trovato.</p>`;
        return;
    }

    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const paginatedMovies = movieList.slice(startIndex, endIndex);

    paginatedMovies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        
        movieCard.innerHTML = `
            <div class="movie-poster-container">
                <img src="${movie.posterUrl}" alt="Locandina di ${movie.title}" loading="lazy">
                <div class="movie-overlay">
                    <p class="movie-description">${movie.description}</p>
                </div>
            </div>
            <div class="movie-info">
                <h3>${movie.title} (${movie.year})</h3>
                <div class="movie-rating">
                    <i class="fas fa-star icon-star"></i>
                    <span>${movie.rating.toFixed(1)}</span>
                </div>
            </div>
        `;
        movieCard.addEventListener('click', () => showDetailView(movie, mainView, detailView));
        movieGrid.appendChild(movieCard);
    });
}