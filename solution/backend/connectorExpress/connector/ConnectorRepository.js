import axios from 'axios';
import NodeCache from 'node-cache';

const MONGO_API = process.env.MONGO_SERVER_URL || 'http://localhost:3000/api';
const SPRING_API = process.env.SPRING_SERVER_URL || 'http://localhost:8080/api';

// Create cache instance, for 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

// Fetches a movie by its ID, using cache to avoid unnecessary API calls
const fetchMovieById = async (id) => {
    const cacheKey = `movie_${id}`;

    try {
        // Check if the movie is already cached
        const cachedMovie = cache.get(cacheKey);
        if (cachedMovie) {
            console.log(`Returning cached movie ${id}`);
            return cachedMovie;
        }

        // Fetch movie data from the Spring Boot API if not cached
        const response = await axios.get(`${SPRING_API}/movies/${id}`);
        const movieDTO = response.data;

        // Transform the API response to the expected movie object format
        const transformedMovie = {
            id: movieDTO?.movieId || 0,
            title: movieDTO?.name || 'Unknown',
            year: movieDTO?.date ? new Date(movieDTO.date).getUTCFullYear() : 0,
            posterUrl: movieDTO.link || 'https://placehold.co/300x450?text=No+Image',
            description: movieDTO.description || '',
            rating: movieDTO.rating || 'N/A',
            minute: movieDTO.minute || 0,
            actors: movieDTO.actors || [],
            genres: movieDTO.genres || [],
            languages: movieDTO.languages || [],
            hasOscar: movieDTO.hasOscar || false
        };

        // Store the transformed movie in cache for future requests
        cache.set(cacheKey, transformedMovie);
        return transformedMovie;

    } catch (error) {
        // Log and rethrow any errors encountered during the fetch
        console.error(`Failed to fetch movie ${id}:`, error);
        throw error;
    }
};

// Fetches a paginated list of movies by type (recent or top-rated) with caching
const fetchMoviesPaginated = async (type, page = 0, size = 10) => {
    const cacheKey = `movies_${type}_${page}_${size}`;

    try {
        // Check cache first
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log(`Returning cached ${type} movies page ${page}`);
            return cachedData;
        }

        // Build URL based on type
        let url;
        switch(type) {
            case 'recent':
                url = `${SPRING_API}/movies/recent`;
                break;
            case 'top-rated':
                url = `${SPRING_API}/movies/top-rated`;
                break;
            default:
                throw new Error('Invalid movie type');
        }

        // Make request with pagination parameters
        const response = await axios.get(url, {
            params: {
                page,
                size
            },
            timeout: 10000
        });

        const pageData = response.data;

        // Transform movies to consistent format
        const transformedMovies = pageData.content.map(movieDTO => ({
            id: movieDTO.movieId,
            title: movieDTO.name,
            year: movieDTO.date ? new Date(movieDTO.date).getFullYear() : 0,
            posterUrl: movieDTO.link || 'https://placehold.co/300x450?text=No+Image',
            description: movieDTO.description,
            minute: movieDTO.minute,
            rating: movieDTO.rating || 0.0
        }));

        const result = {
            content: transformedMovies,
            totalPages: pageData.totalPages,
            totalElements: pageData.totalElements
        };

        cache.set(cacheKey, result);
        return result;

    } catch (error) {
        console.error(`Failed to fetch ${type} movies:`, error);
        throw error;
    }
};

// Fetches reviews for a movie from the Reviews Server (MongoDB-based)
const getReviewsFromReviewsServer = async (movieTitle) => {
    try {
        if (!movieTitle || typeof movieTitle !== 'string' || movieTitle.trim() === '') {
            throw new Error('Invalid movie title for reviews');
        }

        const encodedTitle = encodeURIComponent(movieTitle.trim());
        console.log(`[ConnectorRepository] Proxying review request for "${movieTitle}" to Reviews Server: ${MONGO_API}/reviews/movies/${encodedTitle}`);
        const response = await axios.get(`${MONGO_API}/reviews/movies/${encodedTitle}`);
        console.log(`[ConnectorRepository] Received response from ReviewsServer for "${movieTitle}".`);
        return response.data;
    } catch (error) {
        console.error('[ConnectorRepository ERROR] Failed to proxy review request to Reviews Server:', error.message);
        throw new Error(`Failed to fetch reviews from Reviews Server: ${error.message}`);
    }
};

// Fetches all genres from the Spring Boot API, with caching
const fetchAllGenres = async () => {
    const cacheKey = 'all_genres';

    try {
        // Check cache first
        const cachedGenres = cache.get(cacheKey);
        if (cachedGenres) {
            console.log('Returning cached genres');
            return cachedGenres;
        }

        // Fetch from API
        const response = await axios.get(`${SPRING_API}/genres/allGenres`, { timeout: 5000 });
        const genres = response.data;

        // Cache the result
        cache.set(cacheKey, genres);
        return genres;

    } catch (error) {
        console.error('Failed to fetch genres by title:', {
            url: `${SPRING_API}/genres/allGenres`,
            error: error.message,
            stack: error.stack
        });

        if (error.response) {
            throw new Error(`Server responded with ${error.response.status}`);
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('Request setup error');
        }
    }
};

// Fetches movies filtered by title, paginated, with caching
const fetchFilteredByTitleMovies = async (title, page = 0, size = 10) => {
    return supportFilteredMovies('title', title, page, size);
};

// Fetches movies filtered by genre, paginated, with caching
const fetchFilteredByGenreMovies = async (genre, page = 0, size = 10) => {
    return supportFilteredMovies('genre', genre, page, size);
};

// Fetches movies filtered by year, paginated, with caching
const fetchFilteredByYearMovies = async (year, page = 0, size = 10) => {
    return supportFilteredMovies('year', year, page, size);
};

// Fetches movies filtered by language, paginated, with caching
const fetchFilteredByLanguageMovies = async (language, page = 0, size = 10) => {
    return supportFilteredMovies('language', language, page, size);
};

// Fetches movies filtered by actor, paginated, with caching
const fetchFilteredByActorMovies = async (actor, page = 0, size = 10) => {
    return supportFilteredMovies('actor', actor, page, size);
};

// Supports filtered movie fetching, paginated, with caching
const supportFilteredMovies = async (filterType, filterValue, page = 0, size = 10) => {
    const cacheKey = `filteredMovies_${filterType}_${filterValue}_page_${page}_size_${size}`;
    const cachedMovies = cache.get(cacheKey);
    if (cachedMovies) {
        console.log('Returning cached movies');
        return cachedMovies;
    }

    try {
        const response = await axios.get(`${SPRING_API}/movies/search/${filterType}`, {
            params: {
                [filterType]: filterValue,
                page,
                size
            },
            timeout: 10000
        });

        console.log('Connection successful');
        const pageData = response.data;

        // Transform each movieDTO to the expected format
        const transformedMovies = pageData.content.map(movieDTO => ({
            id: movieDTO.movieId,
            title: movieDTO.name,
            year: new Date(movieDTO.date).getUTCFullYear(),
            posterUrl: movieDTO.link || 'https://placehold.co/300x450?text=No+Image',
            description: movieDTO.description || '',
            rating: movieDTO.rating || 0.0,
            minute: movieDTO.minute || 0,
            actors: movieDTO.actors || [],
            genres: movieDTO.genres || [],
            languages: movieDTO.languages || [],
            hasOscar: movieDTO.hasOscar || false
        }));

        const result = {
            content: transformedMovies,
            totalPages: pageData.totalPages,
            totalElements: pageData.totalElements,
            currentPage: pageData.number, // Add current page number from Spring response
            pageSize: pageData.size       // Add page size from Spring response
        };

        // Cache result
        cache.set(cacheKey, result);
        return result;

    } catch (error) {
        console.error(`Failed to fetch movies by ${filterType}:`, {
            url: `${SPRING_API}/movies/search/${filterType}?${filterType}=${filterValue}`,
            error: error.message,
            stack: error.stack
        });

        if (error.response) {
            throw new Error(`Server responded with ${error.response.status}`);
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('Request setup error');
        }
    }
};

// Export all repository functions
export default {
    fetchMovieById,
    fetchMoviesPaginated,
    getReviewsFromReviewsServer,
    fetchAllGenres,
    fetchFilteredByTitleMovies,
    fetchFilteredByGenreMovies,
    fetchFilteredByYearMovies,
    fetchFilteredByLanguageMovies,
    fetchFilteredByActorMovies,
    supportFilteredMovies
};