import { API_BASE_URL, formatMovieData, moviesPerPage } from './utils.js';
import { displayMoviePage } from './pagination.js';
import { showFilmLoader, hideFilmLoader } from '../loader/loader.js'; // Loader functions for UI feedback
import { reattachSearchListeners } from './modalHandler.js';

let currentPage = 1;
let currentView = '';
let totalPages = 1;
const modal = document.getElementById('movie-modal-search');

// Fetch all available genres from the API
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

// Initialize the search UI and listeners
export async function initSearch() {
    const searchType = document.getElementById("search-type");
    const searchInput = document.getElementById("search-input");
    const searchGenre = document.getElementById("search-genre");
    let genresList = ["Select a genre"];

    // Load genres from the API and populate the dropdown
    async function loadGenres() {
        try {
            let genres = await fetchAllGenres();
            genresList.push(...genres);
            populateGenreDropdown();
        } catch (error) {
            console.error("Error loading genres:", error);
        }
    }

    // Populate the genre dropdown with the fetched genres
    function populateGenreDropdown() {
        searchGenre.innerHTML = "";
        genresList.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre;
            option.textContent = genre;
            searchGenre.appendChild(option);
        });
    }

    // Handle search type change (e.g., show/hide input or genre dropdown)
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

    // Search button click event
    document.getElementById('search-button').addEventListener('click', () => {
        searchMovies(0);
    });

    await loadGenres();
}

// Main function to search movies based on selected filter and page
async function searchMovies(page = 0) {
    try {
        const type = document.getElementById("search-type").value;
        currentPage = page + 1;

        let data;
        // Determine which filter to use based on search type
        if (type === "YEAR") {
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

        // Handle no results
        if (!data || !data.content || data.content.length === 0) {
            document.getElementById('movie-grid-search').innerHTML = '<p class="no-results">No films found</p>';
            document.getElementById('pagination-container-search').innerHTML = '';
            return;
        }
        // Format movies for display
        const formattedMovies = data.content.map(movie => formatMovieData(movie));
        totalPages = data.totalPages;

        // Display movies and pagination
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

        // Reattach event listeners for dynamically loaded search results
        reattachSearchListeners();
    } catch (error) {
        console.error('Error during movie search:', error);
        document.getElementById('movie-grid-search').innerHTML = '<p class="error-message">Failed to load movies. Please try again.</p>';
    }
}

// Load movies filtered by the current view (genre, year, language, actor)
async function loadFilteredMovies(page = 0, currentView) {
    try {
        showFilmLoader(); // Show loader while fetching
        const size = document.getElementById("page-size").value;
        let url;
        let searchValue;

        switch (currentView) {
            case "genre": {
                searchValue = document.getElementById("search-genre").value;
                if (!searchValue || searchValue === "Select a genre") return { content: [], totalPages: 1, totalElements: 0 };
                const encoded = encodeURIComponent(searchValue);
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

        // Handle both array and paginated response
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
    } finally {
        hideFilmLoader(); // Always hide loader after fetch
    }
}

// Export the searchMovies function to be called from views.js
export async function performSearch() {
    await searchMovies(0);
}
