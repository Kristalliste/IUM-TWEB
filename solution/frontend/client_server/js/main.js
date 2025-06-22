import {API_BASE_URL, debounce, toTitleCase, capitalizeDescription } from './utils.js';
import { fetchMovies, fetchMovieDetails } from './api.js';
import { showMainView, showDetailView, renderMovies } from './views.js';
import { displayMoviePage, renderPagination } from './pagination.js';
import { populateGenres } from './genres.js';
import {renderUsernamePrompt} from "./chat.js";

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

function formatMovieData(movie) {
    return {
        id: movie.id,
        title: toTitleCase(movie.title),
        year: movie.year,
        posterUrl: movie.posterUrl || 'https://placehold.co/300x450?text=No+Image',
        description: capitalizeDescription(movie.description),
        rating: movie.rating || 0,
        //actors: movie.actors || [],
       // genres: movie.genres || [],
       // language: movie.languages || [],
        hasOscar: movie.hasOscar || false
    };
}

async function loadMovies() {
    try {
        const response = await fetch(`${API_BASE_URL}/movies`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        return data.map(movie => formatMovieData(movie));
    } catch (error) {
        console.error('Could not load movies. Please try again.', error);
        return [];
    }
}

async function loadFilteredByTitleMovies() {
    try {
        const title = document.getElementById("searchInput").value;
        console.log(title);
        //const response = await fetch(`${API_BASE_URL}/filteredMovies/${title}`);

        // URL-encode the title for use in the path
        const encodedTitle = encodeURIComponent(title);
        let page = 0;
        console.log("Encoded title:", encodedTitle);

        const response = await fetch(`${API_BASE_URL}/filteredMovies/${encodedTitle}/page`);
        console.log(response);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log(data);
        return data.map(movie => formatMovieData(movie));
    } catch (error) {
        console.error('Movies not found. Please try again.', error);
        return [];
    }
}

// FUNZIONE AGGIUNTA: setActiveLink
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
        allMovies = await loadMovies(); // deve andare a richiamare un'altra query
    }

    const topRatedMovies = [...allMovies].sort((a, b) => b.rating - a.rating);
    currentPage = 1;
    mainTitle.textContent = 'Film Top Rated';
    setActiveLink(topRatedLink);
    displayMoviePage(topRatedMovies, paginationContainer, movieGrid, currentPage, mainView, detailView);
});

searchInput.addEventListener('input', debounce(async (e) => {
    showMainView(mainView, detailView);
    setActiveLink(null);

    //if (allMovies.length === 0) allMovies = await loadMovies(); //far chiamare la query
    let filteredMovies = await loadFilteredByTitleMovies();
    if(!filteredMovies) {
        console.error('Could not find movie list');
        return;
    }
    const searchTerm = e.target.value.toLowerCase().trim();
    if (searchTerm) {
        mainTitle.textContent = `Risultati per: "${searchTerm}"`;
/*        const filteredMovies = allMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.year.toString().includes(searchTerm)
        );*/
        displayMoviePage(filteredMovies, paginationContainer, movieGrid, 1, mainView, detailView);
    } else {
        const recentMovies = [...allMovies].sort((a, b) => b.year - a.year);
        mainTitle.textContent = 'Film più recenti';
        displayMoviePage(recentMovies, paginationContainer, movieGrid, 1, mainView, detailView);
    }
}, 300));

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
    movieGrid.innerHTML = '<p class="loading">Caricamento film in corso...</p>';

    allMovies = await loadMovies();

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

    showMainView(mainView, detailView);
    const recentMovies = [...allMovies].sort((a, b) => b.year - a.year);
    mainTitle.textContent = 'Film più recenti';
    setActiveLink(null);  // Nessun link attivo inizialmente
    displayMoviePage(recentMovies, paginationContainer, movieGrid, currentPage, mainView, detailView);

}

document.getElementById('toggle-chat-btn').addEventListener('click', () => {
    const floatingChat = document.getElementById('floating-chat');
    floatingChat.classList.toggle('hidden');

    // Initialize chat only when opening
    if (!floatingChat.classList.contains('hidden')) {
        const chatWrapper = document.getElementById('floating-chat-body');
        renderUsernamePrompt(chatWrapper, "homepage", 1);
    }
});

document.getElementById('close-chat-btn').addEventListener('click', () => {
    document.getElementById('floating-chat').classList.add('hidden');
});


// Ensures all HTML is parsed before JS runs
document.addEventListener('DOMContentLoaded', () => {
    init(); // Now safe to access DOM
});