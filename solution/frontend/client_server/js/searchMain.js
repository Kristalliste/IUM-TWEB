import {renderUsernamePrompt} from "./chat.js";
// import axios from "axios";
// import {showMainView} from "./views";
// import {loadAndDisplayMoviesPage} from "./main";



let currentPage = 1;
let currentView = 'recent'; // 'recent', 'top-rated', 'search'
let currentSearchTerm = '';
let totalPages = 1;

document.getElementById('search-button').addEventListener('click', () => {
    console.log("user clicked");
});

document.addEventListener("DOMContentLoaded", () => {
    const logoElement = document.getElementById("logo");
    const searchType = document.getElementById("search-type");
    const searchInput = document.getElementById("search-input"); // ✅ CORRETTO
    const searchGenre = document.getElementById("search-genre"); // ✅ CORRETTO
    let genresList = []; // Array per salvare i generi

    // Carica i generi una sola volta al caricamento della pagina
    function loadGenres() {
        fetch ("http://localhost:8080/api/movies/genres") // Cambia endpoint se necessario
            .then(response => {
                genresList = response.data || []; // Salva i generi nell'array
            })
            .catch(error => {
                console.error("Errore caricamento generi:", error);
            });
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
    console.log("Elemento searchType:", document.getElementById("search-type"));
    searchType.addEventListener("change", () => {
        const type = searchType.value;
        console.log("Tipo selezionato:", type); // DEBUG
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
            window.location.href = 'demo.html?view=recent';
        });
    }

    // Carica i generi all'avvio della pagina
    loadGenres();
    //loadAllMovies(0);
});

function setActiveLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

