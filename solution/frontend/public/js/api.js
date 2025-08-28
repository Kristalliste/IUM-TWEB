import {API_BASE_URL, formatMovieDetails, moviesPerPage} from './utils.js';

// Fetches details for a specific movie by its ID
/*export async function fetchMovieDetails(movieId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies/${movieId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch movie details: ${error.message}`);
    }
}*/

// Fetches reviews for a movie by its title
export async function fetchMovieReviews(movieTitle) {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/reviews/movies/${encodeURIComponent(movieTitle)}`
        );

        // Ensure reviews is always an array
        if (!response.data.reviews || !Array.isArray(response.data.reviews)) {
            response.data.reviews = [];
        }

        return response.data;
    } catch (error) {
        console.error(`Error fetching movie reviews for "${movieTitle}":`, error);
        return { reviews: [] };
    }
}

// Fetch movies from the API with pagination and type (recent, top-rated, etc.)
export async function fetchMovies(type, page = 0, query = '') {
    try {
        const params = new URLSearchParams({
            page,
            size: moviesPerPage
        });

        params.append('type', type);

        const response = await axios.get(`${API_BASE_URL}/movies`, { params });
        const data = response.data;

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

// Fetch movies filtered by title, with pagination
export async function fetchFilteredByTitleMovies(page = 0) {
    try {
        const title = document.getElementById("searchInput").value;
        // if(title == null || title === "") { return; }
        if (!title) return { content: [], totalPages: 1, totalElements: 0 };

        // URL-encode the title for use in the path
        const encodedTitle = encodeURIComponent(title);
        const response = await axios.get(
            `${API_BASE_URL}/filteredMovies/${encodedTitle}`,
            {
                params: {
                    page,
                    size: moviesPerPage
                }
            }
        );

        const data = response.data;

        // If response is an array
        if (Array.isArray(data)) {
            return {
                content: data,
                totalPages: Math.ceil(data.length / moviesPerPage),
                totalElements: data.length
            };
        }
        else if (data.content) {    // If response is paginated object
            return data;
        }
        return { content: [], totalPages: 1, totalElements: 0 };    // Fallback for unexpected formats
    } catch (error) {
        console.error('Error fetching filtered movies:', error);
        return { content: [], totalPages: 1, totalElements: 0, error: error.message };
    }
}

// Fetch all available genres from the API
export async function fetchAllGenres() {
    try {
        const response = await axios.get(`${API_BASE_URL}/genres`);
        return response.data;
    } catch (error) {
        console.error('API Error: Failed to fetch genres', error);
        throw error;
    }
}

// Load movies filtered by the current view (genre, year, language, actor)
export async function fetchFilteredMovies(page = 0, currentView) {
    try {
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

        const response = await axios.get(url);
        const data = response.data;

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
    }
}

// Fetch movie details from API and format them
export async function fetchMovieDetails(movieId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies/${movieId}`);
        return formatMovieDetails(response.data);
    } catch (error) {
        console.error("Fetch error:", error);
        // Return a default error object if fetch fails
        return {
            title: "Error Loading Movie",
            description: error.message,
            rating: 0,
            posterUrl: "https://placehold.co/300x450?text=Error+Loading",
            year: 'N/A',
            hasOscar: false
        };
    }
}