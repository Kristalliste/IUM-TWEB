// Aggiungi questa funzione per creare le card dei film con poster
function displayResults(movies) {
    const results = document.getElementById("results");
    results.innerHTML = "";

    if (movies.length === 0) {
        results.innerHTML = "<p>Nessun film trovato.</p>";
        return;
    }

    // Crea un contenitore a griglia
    const gridContainer = document.createElement("div");
    gridContainer.className = "movies-grid";
    results.appendChild(gridContainer);

    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.className = "movie-card";

        // Poster
        const poster = document.createElement("img");
        poster.className = "movie-poster";
        poster.src = movie.link || 'default-poster.jpg'; // Immagine di default
        poster.alt = movie.title + ' poster';

        // Info film
        const infoDiv = document.createElement("div");
        infoDiv.className = "movie-info";

        const title = document.createElement("h3");
        title.textContent = movie.title;

        const year = document.createElement("p");
        const movieDate = new Date(movie.date);
        year.textContent = movieDate.getFullYear();

        const rating = document.createElement("p");
        rating.textContent = "★ " + (movie.rating || "-");
        rating.className = "movie-rating";

        // Aggiungi i generi (se disponibili)
        if (movie.genres && movie.genres.length > 0) {
            const genres = document.createElement("p");
            genres.className = "movie-genres";
            genres.textContent = movie.genres.join(", ");
            infoDiv.appendChild(genres);
        }

        // Aggiungi elementi alla card
        infoDiv.appendChild(title);
        infoDiv.appendChild(year);
        infoDiv.appendChild(rating);

        movieCard.appendChild(poster);
        movieCard.appendChild(infoDiv);
        gridContainer.appendChild(movieCard);
    });
}

function searchMovies(page) {
    showFilmLoader();
    const type = document.getElementById("search-type").value;
    let query = document.getElementById("search-input").value;

    const size = parseInt(document.getElementById("page-size").value);
    let url;

    if (type === "TITLE") {
        url = `http://localhost:8080/api/movies/search/title?title=${encodeURIComponent(query)}&page=${page}&size=${size}`;
    } else if (type === "YEAR") {
        url = `http://localhost:8080/api/movies/search/year?year=${encodeURIComponent(query)}&page=${page}&size=${size}`;
    } else if (type === "GENRE") {
        url = `http://localhost:8080/api/movies/search/genre?genre=${encodeURIComponent(query)}&page=${page}&size=${size}`;
    }


    //axios.get(`http://localhost:8080/api/movies/search/${type}/${encodeURIComponent(query)}/${page}/${size}`)
    axios.get(url)
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
        });

}

function setupPagination(totalPages, currentPage, size, onPageChange) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const createButton = (text, disabled, onClick, isCurrent = false) => {
        const btn = document.createElement("button");
        btn.innerText = text;
        btn.disabled = disabled;
        if (onClick) btn.onclick = onClick;
        if (isCurrent) btn.style.fontWeight = "bold";
        return btn;
    };

    // ← Indietro
    pagination.appendChild(
        createButton("←", currentPage === 0, () => onPageChange(currentPage - 1))
    );

    const maxVisible = 5;
    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages - 1, currentPage + 2);

    if (currentPage <= 2) {
        end = Math.min(totalPages - 1, maxVisible - 1);
    } else if (currentPage >= totalPages - 3) {
        start = Math.max(0, totalPages - maxVisible);
    }

    // First page + ...
    if (start > 0) {
        pagination.appendChild(createButton("1", false, () => onPageChange(0)));
        if (start > 1) {
            const dots = document.createElement("span");
            dots.innerText = "…";
            dots.style.margin = "0 4px";
            pagination.appendChild(dots);
        }
    }

    // Middle buttons
    for (let i = start; i <= end; i++) {
        pagination.appendChild(
            createButton(i + 1, false, () => onPageChange(i), i === currentPage)
        );
    }

    // ... + Last page
    if (end < totalPages - 1) {
        if (end < totalPages - 2) {
            const dots = document.createElement("span");
            dots.innerText = "…";
            dots.style.margin = "0 4px";
            pagination.appendChild(dots);
        }
        pagination.appendChild(
            createButton(totalPages, false, () => onPageChange(totalPages - 1))
        );
    }

    // → Avanti
    pagination.appendChild(
        createButton("→", currentPage === totalPages - 1, () => onPageChange(currentPage + 1))
    );
}



document.addEventListener("DOMContentLoaded", () => {
    const searchType = document.getElementById("search-type");
    const searchInput = document.getElementById("search-input");
    const searchGenre = document.getElementById("search-genre");

    let genresList = []; // Array per salvare i generi

    // Carica i generi una sola volta al caricamento della pagina
    function loadGenres() {
        axios.get("http://localhost:8080/api/movies/genres") // Cambia endpoint se necessario
            .then(response => {
                genresList = response.data || []; // Salva i generi nell'array
            })
            .catch(error => {
                console.error("Errore caricamento generi:", error);
            });
    }

    function loadAllMovies(page){
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
    }

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

    // Event listener per cambio tipo di ricerca
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

    // Carica i generi all'avvio della pagina
    loadGenres();
    loadAllMovies(0);
});



