import { API_BASE_URL, debounce, toTitleCase, capitalizeDescription, moviesPerPage } from './utils.js';
import { showMainView, showDetailView, renderMovies } from './views.js';
import { displayMoviePage } from './pagination.js';
import { populateGenres } from './genres.js';
import { renderUsernamePrompt } from "./chat.js";

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
let currentView = 'recent'; // 'recent', 'top-rated', 'search'
let currentSearchTerm = '';
let totalPages = 1;

// Funzione per formattare i dati del film
function formatMovieData(movie) {
    return {
        id: movie.id,
        title: movie.title ? toTitleCase(movie.title) : 'Untitled Movie',
        year: movie.year || (movie.date ? new Date(movie.date).getUTCFullYear() : 0),
        posterUrl: movie.posterUrl || movie.link || 'https://placehold.co/300x450?text=No+Image',
        description: capitalizeDescription(movie.description),
        rating: movie.rating || 0, // Ensure rating defaults to 0
        minute: movie.minute || 0,
        hasOscar: movie.hasOscar || false
    };
}

// Funzioni per il fetching paginato
async function fetchMovies(type, page = 0, query = '') {
    try {
        let url = `${API_BASE_URL}/movies`;
        const params = new URLSearchParams({
            page,
            size: moviesPerPage
        });

/*        if (type === 'search') {
            url = `${API_BASE_URL}/movies/search`;
            params.append('query', query);
        } else {*/
            params.append('type', type);
        //}

        const response = await fetch(`${url}?${params}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Handle different response structures
        const data = await response.json();

        // If response is an array (for recent movies)
        if (Array.isArray(data)) {
            return {
                content: data,
                totalPages: Math.ceil(data.length / moviesPerPage),
                totalElements: data.length
            };
        }
        // If response is paginated object
        else if (data.content) {
            return data;
        }
        // Fallback for unexpected formats
        return { content: [], totalPages: 1, totalElements: 0 };
    } catch (error) {
        console.error(`Error fetching ${type} movies:`, error);
        return { content: [], totalPages: 1, totalElements: 0 };
    }
}

// Carica e mostra una pagina di film
async function loadAndDisplayMoviesPage(page = 0) {
    currentPage = page + 1; // Converti in 1-indexed per UI
    let data;
    if (currentView === 'search') {
        //data = await fetchMovies('search', page, currentSearchTerm);
        data = await loadFilteredByTitleMovies(page);
    } else {
        data = await fetchMovies(currentView, page);
    }

    const formattedMovies = data.content.map(movie => formatMovieData(movie));
    totalPages = data.totalPages;

    displayMoviePage(
        formattedMovies,
        paginationContainer,
        movieGrid,
        currentPage,
        totalPages,
        mainView,
        detailView,
        (pageIndex) => { // Callback per cambio pagina
            loadAndDisplayMoviesPage(pageIndex);
        }
    );
}

async function loadFilteredByTitleMovies(page = 0) {
    try {
        const title = document.getElementById("searchInput").value;
        //console.log(title);
        //const response = await fetch(`${API_BASE_URL}/filteredMovies/${title}`);

        // URL-encode the title for use in the path
        const encodedTitle = encodeURIComponent(title);
        //let page = 0;

        //console.log("Encoded title:", encodedTitle);

        const response = await fetch(`${API_BASE_URL}/filteredMovies/${encodedTitle}?page=${page}&size=${moviesPerPage}`);
        //console.log(response);
        const data = await response.json();
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        // If response is an array (for recent movies)
        if (Array.isArray(data)) {
            return {
                content: data,
                totalPages: Math.ceil(data.length / moviesPerPage),
                totalElements: data.length
            };
        }
        // If response is paginated object
        else if (data.content) {
            return data;
        }
        // Fallback for unexpected formats
        return { content: [], totalPages: 1, totalElements: 0 };
    } catch (error) {
        console.error('Movies not found. Please try again.', error);
        return { content: [], totalPages: 1, totalElements: 0 };
    }
}

// FUNZIONE AGGIUNTA: setActiveLink
function setActiveLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Gestori eventi
topRatedLink.addEventListener('click', async (e) => {
    e.preventDefault();
    showMainView(mainView, detailView);
    searchInput.value = '';

    currentView = 'top-rated';
    currentPage = 1;
    mainTitle.textContent = 'Film Top Rated';
    setActiveLink(topRatedLink);

    await loadAndDisplayMoviesPage(0);
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
    currentView = 'search';
    currentPage = 1;
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm) {
        mainTitle.textContent = `Risultati per: "${searchTerm}"`;
/*        const filteredMovies = allMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.year.toString().includes(searchTerm)
        );*/
        //displayMoviePage(filteredMovies, paginationContainer, movieGrid, 1, mainView, detailView);
        await loadAndDisplayMoviesPage(0);
    } else {
        currentView = 'recent';
        mainTitle.textContent = 'Film più recenti';
        await loadAndDisplayMoviesPage(0);
    }
}, 300));

logo.addEventListener('click', async () => {
    searchInput.value = '';
    currentView = 'recent';
    currentPage = 1;
    showMainView(mainView, detailView);
    mainTitle.textContent = 'Film più recenti';
    setActiveLink(null);

    await loadAndDisplayMoviesPage(0);
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

// Inizializzazione
async function init() {
    movieGrid.innerHTML = '<p class="loading">Caricamento film in corso...</p>';

    try {
        // Carica prima pagina di film recenti
        const initialData = await fetchMovies('recent', 0);

        // Estrai film per i generi (solo prima pagina)
        const moviesForGenres = initialData.content.map(movie => formatMovieData(movie));

        populateGenres(
            moviesForGenres,
            mainView,
            detailView,
            searchInput,
            currentPage,
            mainTitle,
            genresLink,
            setActiveLink,
            async (page) => {
                await loadAndDisplayMoviesPage(page - 1);
            },
            paginationContainer,
            movieGrid
        );

        showMainView(mainView, detailView);
        mainTitle.textContent = 'Film più recenti';
        setActiveLink(null);
        await loadAndDisplayMoviesPage(0);
    } catch (error) {
        console.error('Initialization error:', error);
        movieGrid.innerHTML = `
            <div class="error" style="grid-column: 1 / -1; text-align: center; padding: 20px;">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Errore durante il caricamento</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Gestione chat
document.getElementById('toggle-chat-btn').addEventListener('click', () => {
    const floatingChat = document.getElementById('floating-chat');
    floatingChat.classList.toggle('hidden');

    if (!floatingChat.classList.contains('hidden')) {
        const chatWrapper = document.getElementById('floating-chat-body');
        renderUsernamePrompt(chatWrapper, "homepage", 1);
    }
});

document.getElementById('close-chat-btn').addEventListener('click', () => {
    document.getElementById('floating-chat').classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', init);