import { fetchMovies, fetchMovieDetails } from './api.js';
import { showMainView, showDetailView, renderMovies } from './views.js';
import { displayMoviePage, renderPagination } from './pagination.js';
import { populateGenres } from './genres.js';

// DOM elements
const movieGrid = document.getElementById('movie-grid');
const searchInput = document.getElementById('searchInput');
const mainView = document.querySelector('main');
const detailView = document.getElementById('movie-detail-view');
const logo = document.querySelector('.logo');
const paginationContainer = document.getElementById('pagination-container');
const mainTitle = document.getElementById('main-title');
const topRatedLink = document.getElementById('top-rated-link');
const advancedSearchLink = document.getElementById('advanced-search-link');
const navLinks = document.querySelectorAll('.main-nav ul > li > a');
const genresLink = document.getElementById('genres-link');

// State
let currentPage = 1;
let allMovies = [];

// API configuration
const API_BASE_URL = 'http://localhost:4000/api';

function formatMovieData(movie) {
    return {
        id: movie.movieId,
        title: movie.name,
        year: new Date(movie.date).getFullYear(),
        posterUrl: movie.link || 'https://via.placeholder.com/300x450?text=No+Image',
        description: movie.description,
        rating: movie.rating || 0.0, // Usa il rating dal backend
        actors: movie.actors || [],
        genres: movie.genres || [],
        reviews: [] // Non necessario per la lista principale
    };
}

// Funzione per ottenere i film dal backend
async function loadMovies() {
    try {
        const response = await fetch(`${API_BASE_URL}/movies`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.map(movie => ({
            id: movie.movieId,
            title: movie.name,
            year: new Date(movie.date).getFullYear(),
            posterUrl: movie.link || 'https://via.placeholder.com/300x450?text=No+Image',
            description: movie.description,
            rating: movie.rating || 0.0,
            actors: movie.actors || [],
            genres: movie.genres || []
        }));
    } catch (error) {
        console.error('Errore nel caricamento dei film:', error);
        mainTitle.textContent = 'Errore nel caricamento dei film';
        movieGrid.innerHTML = `
            <p class="error" style="grid-column: 1 / -1;">
                Impossibile caricare i film: ${error.message}
            </p>
        `;
        return [];
    }
}

function setActiveLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

topRatedLink.addEventListener('click', async (e) => {
    e.preventDefault();
    showMainView(mainView, detailView);
    searchInput.value = '';

    if (allMovies.length === 0) {
        allMovies = await loadMovies();
    }

    const topRatedMovies = [...allMovies].sort((a, b) => b.rating - a.rating);
    currentPage = 1;
    mainTitle.textContent = 'Film Top Rated';
    setActiveLink(topRatedLink);
    displayMoviePage(topRatedMovies, paginationContainer, movieGrid, currentPage, mainView, detailView);
});

searchInput.addEventListener('input', async (e) => {
    showMainView(mainView, detailView);
    setActiveLink(null);

    if (allMovies.length === 0) {
        allMovies = await loadMovies();
    }

    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm) {
        mainTitle.textContent = `Risultati per: "${searchTerm}"`;
        const filteredMovies = allMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.year.toString().includes(searchTerm)
        );
        currentPage = 1;
        displayMoviePage(filteredMovies, paginationContainer, movieGrid, currentPage, mainView, detailView);
    } else {
        const recentMovies = [...allMovies].sort((a, b) => b.year - a.year);
        mainTitle.textContent = 'Film più recenti';
        currentPage = 1;
        displayMoviePage(recentMovies, paginationContainer, movieGrid, currentPage, mainView, detailView);
    }
});

logo.addEventListener('click', async () => {
    searchInput.value = '';
    currentPage = 1;
    showMainView(mainView, detailView);

    if (allMovies.length === 0) {
        allMovies = await loadMovies();
    }

    const recentMovies = [...allMovies].sort((a, b) => b.year - a.year);
    mainTitle.textContent = 'Film più recenti';
    setActiveLink(null);
    displayMoviePage(recentMovies, paginationContainer, movieGrid, currentPage, mainView, detailView);
});

// Advanced search event handler
advancedSearchLink.addEventListener('click', (e) => {
    e.preventDefault();
    showMainView(mainView, detailView);
    searchInput.value = '';
    mainTitle.textContent = 'Ricerca Avanzata';
    setActiveLink(advancedSearchLink);

    movieGrid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
      <h3>Funzionalità Ricerca Avanzata</h3>
      <p>Questa funzionalità sarà implementata prossimamente!</p>
      <p>Potrai cercare film per anno, genere, rating e altro.</p>
    </div>
  `;
    paginationContainer.innerHTML = '';
});

// Initial render
async function init() {
    // Carica indicatori di caricamento
    movieGrid.innerHTML = '<p class="loading">Caricamento film in corso...</p>';

    // Carica i film dal backend
    const recentMovies = await loadMovies();

    // Popola i generi
    populateGenres(
        allMovies,
        mainView,
        detailView,
        searchInput,
        currentPage,
        mainTitle,
        genresLink,
        setActiveLink,
        displayMoviePage,
        paginationContainer,
        movieGrid
    );

    // Mostra la vista principale
    showMainView(mainView, detailView);
    displayMoviePage(recentMovies, paginationContainer, movieGrid, currentPage, mainView, detailView);
}

init();