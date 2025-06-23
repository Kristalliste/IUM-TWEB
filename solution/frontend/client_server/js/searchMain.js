import { API_BASE_URL, debounce, toTitleCase, capitalizeDescription, moviesPerPage } from './utils.js';
import { displayMoviePage } from './pagination.js';
import { renderUsernamePrompt } from "./chat.js";
// import {formatMovieData, loadAndDisplayMoviesPage} from "./main.js";
// DA VALUTARE SE METTERE IN UTILS



let currentPage = 1;
let currentView = '';
let currentSearchTerm = '';
let totalPages = 1;

document.addEventListener("DOMContentLoaded", async () => {
    const logoElement = document.getElementById("logo");
    const searchType = document.getElementById("search-type");
    const searchInput = document.getElementById("search-input"); // ✅ CORRETTO
    const searchGenre = document.getElementById("search-genre"); // ✅ CORRETTO
    let genresList = []; // Array per salvare i generi
    genresList.push("Select a genre");
    // Carica i generi una sola volta al caricamento della pagina
/*    function loadGenres() {
        fetch ("http://localhost:8080/api/movies/genres") // Cambia endpoint se necessario
            .then(response => {
                genresList = response.data || []; // Salva i generi nell'array
            })
            .catch(error => {
                console.error("Errore caricamento generi:", error);
            });
    }*/
    async function loadGenres() {
        try {
            let genres = await fetchAllGenres(); // Wait for genres to load
            genresList.push(...genres);
            populateGenreDropdown(); // Populate dropdown immediately after
        } catch (error) {
            console.error("Error loading genres:", error);
            // Optionally show error to user
        }
    }



/*    function loadAllMovies(page){
        // showFilmLoader();
        const size = parseInt(document.getElementById("page-size").value);

        //axios.get(`http://localhost:8080/api/movies/all/${page}/${size}`) // Cambia endpoint se necessario
        axios.get(`http://localhost:8080/api/movies?page=${page}&size=${size}`)
            .then(response => {
                displayResults(response.data.content);
                setupPagination(response.data.totalPages, page, size, loadAllMovies);
            })
            .catch(error => {
                console.error("Errore nella richiesta:", error);
            })
    }*/

    // Popola il menu a tendina usando l'array genresList
    function populateGenreDropdown() {
        searchGenre.innerHTML = "";

        genresList.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre;
            option.textContent = genre;
            searchGenre.appendChild(option);
        });
    }

    searchType.addEventListener("change", () => {
        const type = searchType.value;
        if (type === "GENRE") {
            searchInput.style.display = "none";
            searchGenre.style.display = "inline-block";
            populateGenreDropdown(); // Usa l'array già caricato
        } else {
            searchGenre.style.display = "none";
            searchInput.style.display = "inline-block";
        }
    });


    if (logoElement) {
        logoElement.addEventListener('click', (e) => {
            e.preventDefault();
            // Reindirizza alla homepage con parametro che indica 'film più recenti'
            window.location.href = 'mainView.html?view=recent';
        });
    }

    // Carica i generi all'avvio della pagina
    await loadGenres();
    //loadAllMovies(0);
    document.getElementById('search-button').addEventListener('click', () => {
        searchMovies(0); // Start with page 0
    });
});

function setActiveLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

async function fetchAllGenres(){
    try {
        const response = await fetch(`${API_BASE_URL}/genres`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch genres');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error; // Rethrow for component handling
    }
}

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

const paginationContainer = document.getElementById('pagination-container');
const movieGrid = document.getElementById('movie-grid');
const mainView = document.querySelector('main');
const detailView = document.getElementById('movie-detail-view');

async function loadAndDisplayMoviesPage(page = 0) {
    currentPage = page + 1; // Converti in 1-indexed per UI
    let data;
    if (currentView === 'title') {
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
        const title = document.getElementById("search-input").value;
        const size = document.getElementById("page-size").value;

        if(title == null || title === "") { return; }

        const encodedTitle = encodeURIComponent(title);

        const response = await fetch(`${API_BASE_URL}/filteredMovies/${encodedTitle}?page=${page}&size=${size}`);
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

async function searchMovies(page) {
    showFilmLoader();
    try{
        const type = document.getElementById("search-type").value;
        let query = document.getElementById("search-input").value;
        let data;
        currentPage = page + 1; // Converti in 1-indexed per UI

        const size = parseInt(document.getElementById("page-size").value);
        let url;

        if (type === "TITLE") {
            currentView = 'title';
            data = await loadFilteredByTitleMovies(page);
            // url = `http://localhost:8080/api/movies/search/title?title=${encodeURIComponent(query)}&page=${page}&size=${size}`;
        } else if (type === "YEAR") {
            url = `http://localhost:8080/api/movies/search/year?year=${encodeURIComponent(query)}&page=${page}&size=${size}`;
        } else if (type === "GENRE") {
            url = `http://localhost:8080/api/movies/search/genre?genre=${encodeURIComponent(query)}&page=${page}&size=${size}`;
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
    catch(error){
        throw error;
    }
    finally{
        hideFilmLoader();
    }

 /*   await fetch (url)
        .then(response => {
            displayResults(response.data.content);
            setupPagination(response.data.totalPages, page, size, searchMovies);
        })
        .catch(error => {
            console.error("Errore nella richiesta:", error);
            document.getElementById("results").innerHTML = "<p>Errore nel caricamento dei dati</p>";
        })
        .finally(() => {
            hideFilmLoader();
        });*/

}

