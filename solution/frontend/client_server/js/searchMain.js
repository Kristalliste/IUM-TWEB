import { API_BASE_URL, toTitleCase, capitalizeDescription, moviesPerPage } from './utils.js';
import { displayMoviePage } from './pagination.js';
import { loadTemplate } from './templateLoader.js';
import { reattachSearchListeners } from './modalHandler.js';

let currentPage = 1;
let currentView = '';
let totalPages = 1;

async function fetchAllGenres() {
    try {
        const response = await fetch(`${API_BASE_URL}/genres`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch genres');
        }
        return await response.json();
    } catch (error) {
        console.error('API Error: Failed to fetch genres', error);
        throw error;
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

export async function initSearch() {
    const searchType = document.getElementById("search-type");
    const searchInput = document.getElementById("search-input");
    const searchGenre = document.getElementById("search-genre");
    let genresList = ["Select a genre"];

    async function loadGenres() {
        try {
            let genres = await fetchAllGenres();
            genresList.push(...genres);
            populateGenreDropdown();
        } catch (error) {
            console.error("Error loading genres:", error);
        }
    }

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
            populateGenreDropdown();
        } else {
            searchGenre.style.display = "none";
            searchInput.style.display = "inline-block";
        }
    });

    document.getElementById('search-button').addEventListener('click', () => {
        searchMovies(0);
    });

    await loadGenres();
}

async function searchMovies(page = 0) {
    try {
        const type = document.getElementById("search-type").value;
        currentPage = page + 1;

        let data;
        if (type === "TITLE") {
            currentView = 'title';
            data = await loadFilteredMovies(page, currentView);
        } else if (type === "YEAR") {
            currentView = 'year';
            data = await loadFilteredMovies(page, currentView);
        } else if (type === "GENRE") {
            currentView = 'genre';
            data = await loadFilteredMovies(page, currentView);
        } else if (type === "LANGUAGE") {
            currentView = 'language';
            data = await loadFilteredMovies(page, currentView);
        } else if (type === "ACTOR") {
            currentView = 'actor';
            data = await loadFilteredMovies(page, currentView);
        }

        if (!data || !data.content || data.content.length === 0) {
            document.getElementById('movie-grid-search').innerHTML = '<p class="no-results">No films found</p>';
            document.getElementById('pagination-container-search').innerHTML = '';
            return;
        }
        const formattedMovies = data.content.map(movie => formatMovieData(movie));
        totalPages = data.totalPages;

        displayMoviePage(
            formattedMovies,
            document.getElementById('pagination-container-search'),
            document.getElementById('movie-grid-search'),
            currentPage,
            totalPages,
            document.querySelector('main'),
            document.getElementById('movie-detail-view-search'),
            (pageIndex) => {
                searchMovies(pageIndex);
            }
        );

        // NEW: Reattach event listeners for search results
        reattachSearchListeners();
    } catch (error) {
        console.error('Error during movie search:', error);
        document.getElementById('movie-grid-search').innerHTML = '<p class="error-message">Failed to load movies. Please try again.</p>';
    }
}

async function loadFilteredMovies(page = 0, currentView) {
    try {
        const size = document.getElementById("page-size").value;
        let url;
        let searchValue;

        switch (currentView) {
            case "title": {
                const title = document.getElementById("search-input").value;
                if (!title) return { content: [], totalPages: 1, totalElements: 0 };
                const encoded = encodeURIComponent(title);
                url = `${API_BASE_URL}/filteredMovies/${encoded}?page=${page}&size=${size}`;
                break;
            }
            case "genre": {
                const genre = document.getElementById("search-genre").value;
                if (!genre || genre === "Select a genre") return { content: [], totalPages: 1, totalElements: 0 };
                const encoded = encodeURIComponent(genre);
                url = `${API_BASE_URL}/filteredByGenreMovies/${encoded}?page=${page}&size=${size}`;
                break;
            }
            case "year": {
                searchValue = document.getElementById("search-input").value;
                if (!searchValue) return { content: [], totalPages: 1, totalElements: 0 };
                const encoded = encodeURIComponent(searchValue);
                url = `${API_BASE_URL}/filteredByYearMovies/${encoded}?page=${page}&size=${size}`;
                break;
            }
            case "language": {
                searchValue = document.getElementById("search-input").value;
                if (!searchValue) return { content: [], totalPages: 1, totalElements: 0 };
                const encoded = encodeURIComponent(searchValue);
                url = `${API_BASE_URL}/filteredByLanguageMovies/${encoded}?page=${page}&size=${size}`;
                break;
            }
            case "actor": {
                searchValue = document.getElementById("search-input").value;
                if (!searchValue) return { content: [], totalPages: 1, totalElements: 0 };
                const encoded = encodeURIComponent(searchValue);
                url = `${API_BASE_URL}/filteredByActorMovies/${encoded}?page=${page}&size=${size}`;
                break;
            }
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (Array.isArray(data)) {
            return {
                content: data,
                totalPages: Math.ceil(data.length / moviesPerPage),
                totalElements: data.length
            };
        } else if (data.content) {
            return data;
        }
        return { content: [], totalPages: 1, totalElements: 0 };
    } catch (error) {
        console.error('Error fetching filtered movies:', error);
        return { content: [], totalPages: 1, totalElements: 0 };
    }
}

// Export the searchMovies function to be called from views.js
export async function performSearch() {
    await searchMovies(0);
}