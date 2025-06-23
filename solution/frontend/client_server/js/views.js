import {capitalizeDescription, escapeHTML, toTitleCase} from './utils.js';
import { renderUsernamePrompt } from './chat.js';
import { fetchMovieDetails, fetchMovieReviews } from './api.js';

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
        actors: movieData.actors || [],
        genres: movieData.genres || [],
        languages: movieData.languages || [],
        hasOscar: movieData.hasOscar || false,
    };
}

// Format movie reviews response to a consistent structure
function formatMovieReviews(movieReviews) {
    // Directly map over movieReviews as it's already an array of review objects
    return {
        reviews: movieReviews.map(review => ({
            critic_name: review.criticName || 'Anonymous',
            top_critic: review.topCritic || false,
            review_date: review.reviewDate || '',
            review_content: review.reviewContent || "The critic didn't leave any comment.",
            normalized_score: review.normalizedScore || 'N/A'
        })) || [],
    };
}

// Function to fetch the HTML template for movie details view
async function fetchMovieDetailTemplate() {
    const response = await fetch('./movieDetail.html');
    if (!response.ok) {
        throw new Error('Failed to load movie detail template');
    }
    return response.text();
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
        const [movieData, movieDetailTemplate] = await Promise.all([
            fetchMovieDetails(movieId),
            fetchMovieDetailTemplate()
        ]);
        const movie = formatMovieDetails(movieData);

        const movieReviews = await fetchMovieReviews(movie.originalTitle);

        const formattedReviews = formatMovieReviews(movieReviews);

        detailView.innerHTML = movieDetailTemplate;

        // Populate dynamic content
        document.getElementById('detail-view-poster').src = movie.posterUrl;
        document.getElementById('detail-view-poster').alt = `${movie.title} poster`;
        document.getElementById('detail-view-title').innerHTML = `${escapeHTML(movie.title)} <span class="year">(${movie.year})</span>`;
        document.getElementById('detail-view-rating').textContent = movie.rating;
        document.getElementById('detail-view-minute').textContent = `${movie.minute} min`;
        document.getElementById('detail-view-description').textContent = escapeHTML(movie.description);

        const oscarIcon = document.getElementById('detail-view-oscar-icon');
        if (movie.hasOscar) {
            oscarIcon.style.display = 'inline-block';
        } else {
            oscarIcon.style.display = 'none';
        }

        const languagesList = document.getElementById('detail-view-languages-list');
        languagesList.innerHTML = (movie.languages || [])
            .map(lang => `<li class="detail-list-item">${escapeHTML(lang)}</li>`)
            .join('') || '<li class="detail-list-item">No languages specified</li>';

        const genresList = document.getElementById('detail-view-genres-list');
        genresList.innerHTML = (movie.genres || [])
            .map(genre => `<li class="detail-list-item">${escapeHTML(genre)}</li>`)
            .join('') || '<li class="detail-list-item">No genres specified</li>';

        const actorsList = document.getElementById('detail-view-actors-list');
        actorsList.innerHTML = (movie.actors || [])
            .map(actor => `<li class="detail-list-item">${escapeHTML(actor)}</li>`)
            .join('') || '<li class="detail-list-item">No cast specified</li>';

        const reviewsList = document.getElementById('reviews-list');
        reviewsList.innerHTML = formattedReviews.reviews && formattedReviews.reviews.length > 0 ?
            formattedReviews.reviews.map(review => `
                    <div class="review-item">
                        <p><strong>Critic:</strong> ${escapeHTML(review.critic_name || 'Anonymous')}</p>
                        <p><strong>Top Critic:</strong> ${review.top_critic ? 'Yes' : 'No'}</p>
                        <p><strong>Score:</strong> ${review.normalized_score}/10</p>
                        <p><strong>Review:</strong> "${escapeHTML(review.review_content)}"</p>
                    </div>
                    `).join('') : '<p>No reviews for this movie yet.</p>';

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
        <h2>Error while loading film details </h2>
        <p>Please try again later</p>
        <p class="error-details">${error.message}</p>
      </div>
    `;

        document.getElementById('back-button').addEventListener('click', () =>
            showMainView(mainView, detailView)
        );
    }
}

// Function to render movie cards (now receives pre-paginated movies)
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
        const rating = movie.rating ? movie.rating : 'N/A';
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
                    <p class="movie-description">${description}</p> <!-- escapeHTML(movie.description)  -->
                </div>
            </div>
            <div class="movie-info">
                <h3>${title} (${year})</h3> <!-- escapeHTML(movie.title) -->
                <div class="movie-rating">
                    <i class="fas fa-star icon-star"></i>
                    <span>${rating}</span>
                </div>
            </div>
        `;

        movieGrid.appendChild(movieCard);
    });
}