import { API_BASE_URL, debounce, toTitleCase, capitalizeDescription, moviesPerPage } from './utils.js';
import { showMainView} from './views.js';
import { displayMoviePage } from './pagination.js';
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

// State
let currentPage = 1;
let currentView = 'recent'; // 'recent', 'top-rated', 'search'
let currentSearchTerm = '';
let totalPages = 1;

// Function to format movie data
function formatMovieData(movie) {
    return {
        id: movie.id,
        title: movie.title ? toTitleCase(movie.title) : 'Untitled Movie',
        year: movie.year || (movie.date ? new Date(movie.date).getUTCFullYear() : 0),
        posterUrl: movie.posterUrl || movie.link || 'https://placehold.co/300x450?text=No+Image',
        description: capitalizeDescription(movie.description),
        rating: movie.rating || 'N/A',
        minute: movie.minute || 0,
        hasOscar: movie.hasOscar || false
    };
}

// Functions for paginated fetching
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

// Loads and shows a page of films
async function loadAndDisplayMoviesPage(page = 0) {
    currentPage = page + 1; // Converti in 1-indexed per UI
    let data;
    console.log('Fetching movies page...');
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
        if(title == null || title === "") { return; }
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

function setActiveLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    if (activeLink) {
        activeLink.classList.add('active');
    }
}


/*// Gestori eventi
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

if (topRatedLink) {
    topRatedLink.addEventListener('click', async (e) => {
        e.preventDefault(); // <-- QUESTO È IL PUNTO CHIAVE!
        window.history.pushState({}, '', 'mainView?view=top-rated.html'); // Questa riga potrebbe non essere necessaria se sei già su demo.html e non vuoi ricaricare
        console.log("ciao");
        // Imposta la UI per i film Top Rated
        // showMainView(mainView, detailView); // Se hai queste variabili globali
        // searchInput.value = ''; // Pulisce la barra di ricerca
        currentView = 'top-rated'; // Aggiorna lo stato interno della pagina
        currentPage = 1; // Resetta la paginazione
        mainTitle.textContent = 'Film Top Rated'; // Cambia il titolo principale della homepage
        setActiveLink(topRatedLink); // Rende attivo il link "Film Top Rated" nella navbar

        await loadAndDisplayMoviesPage(0); // <-- CHIAMA LA FUNZIONE DI CARICAMENTO DEI FILM
    });
}*/

if (topRatedLink) {
    topRatedLink.addEventListener('click', async (e) => {
        e.preventDefault();

        // Cambia l'URL senza ricaricare la pagina
        window.history.pushState({}, '', 'mainView?view=top-rated.html');

        console.log("Navigazione: Top Rated");

        // Mostra vista principale e resetta la ricerca
        showMainView(mainView, detailView);
        searchInput.value = '';

        // Imposta stato interno
        currentView = 'top-rated';
        currentPage = 1;
        mainTitle.textContent = 'Film Top Rated';
        setActiveLink(topRatedLink);

        // Carica la prima pagina di film top-rated
        await loadAndDisplayMoviesPage(0);
    });
}

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
        mainTitle.textContent = `Results for: "${searchTerm}"`;
/*        const filteredMovies = allMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.year.toString().includes(searchTerm)
        );*/
        //displayMoviePage(filteredMovies, paginationContainer, movieGrid, 1, mainView, detailView);
        await loadAndDisplayMoviesPage(0);
    } else {
        currentView = 'recent';
        mainTitle.textContent = 'Most Recent Films';
        await loadAndDisplayMoviesPage(0);
    }
}, 300));

/*logo.addEventListener('click', async () => {
    searchInput.value = '';
    currentView = 'recent';
    currentPage = 1;
    showMainView(mainView, detailView);
    mainTitle.textContent = 'Most Recent Films';
    setActiveLink(null);

    await loadAndDisplayMoviesPage(0);
});*/
// Listener per il logo FilmTWEB per tornare alla homepage e caricare i film recenti
if (logo) { // Verifica che l'elemento esista
    logo.addEventListener('click', async (e) => {
        e.preventDefault(); // Impedisce il comportamento predefinito del link (se il logo fosse un <a>)
        mainTitle.textContent = 'Most Recent Films';
        window.location.href = 'mainView.html';
    });
}

/*advancedSearchLink.addEventListener('click', (e) => {
    e.preventDefault();
    showMainView(mainView, detailView);
    searchInput.value = '';
    mainTitle.textContent = 'Advanced Research';
/!*    searchInput.value = '';
    mainTitle.textContent = 'Ricerca Avanzata';*!/
    setActiveLink(advancedSearchLink);

    const searchLink = document.getElementById('advanced-search-link');
    if (searchLink) {
        searchLink.addEventListener('click', function(event) {
            event.preventDefault(); // Previeni il comportamento di default del link
            window.location.href = 'search.html'; // Percorso alla tua pagina di ricerca avanzata
        });
    }
});*/
// CORREZIONE: Gestore click per "Ricerca Avanzata"
// Questo listener viene aggiunto una sola volta al DOMContentLoaded.
if (advancedSearchLink) { // Verifica che l'elemento esista
    advancedSearchLink.addEventListener('click', (e) => {
        e.preventDefault(); // Previene la navigazione di default
        // Non sono necessarie showMainView o altre manipolazioni UI qui
        // perché si sta navigando a una pagina completamente nuova.
        window.location.href = 'search.html'; // Naviga alla pagina di ricerca avanzata
    });
}

// Inizialization
async function init() {
    movieGrid.innerHTML = '<p class="loading">Loading Films...</p>';

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const requestedView = urlParams.get('view'); // Ottiene il valore del parametro 'view'
        let initialData;
        currentPage = 1; // Resetta sempre la paginazione all'avvio

        if (requestedView === 'top-rated') {
            currentView = 'top-rated';
            // Imposta lo stato attivo del link nella navbar
            const topRatedLinkElement = document.getElementById('top-rated-link');
            if (topRatedLinkElement) { // Verifica che l'elemento esista nel DOM
                setActiveLink(topRatedLinkElement);
                initialData = await fetchMovies('top-rated', 0);
                if (mainTitle)mainTitle.textContent = 'Film Top Rated';
            } else {
                console.warn("Element with ID 'top-rated-link' not found in DOM.");
            }
        } else  {
            // Comportamento di default: carica i film più recenti
            currentView = 'recent';
            if (mainTitle)mainTitle.textContent = 'Most Recent Films';
            setActiveLink(null); // Nessun link specifico attivo per la vista di default 'recenti'
            initialData = await fetchMovies('recent', 0);
        }

        // Carica prima pagina di film recenti
       // const

        showMainView(mainView, detailView);


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

// Chat
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