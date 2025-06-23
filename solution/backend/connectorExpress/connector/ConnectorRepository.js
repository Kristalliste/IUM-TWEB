import axios from 'axios';
import ReviewsDTO from '../../express/reviews/ReviewsDTO.js';
import NodeCache from 'node-cache';

const MONGO_API = process.env.MONGO_SERVER_URL || 'http://localhost:3000/api';
const SPRING_API = process.env.SPRING_SERVER_URL || 'http://localhost:8080/api';

// Create cache instance, for 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

const fetchMovieById = async (id) => {
    const cacheKey = `movie_${id}`;

    try {
        // Check cache first
        const cachedMovie = cache.get(cacheKey);
        if (cachedMovie) {
            console.log(`Returning cached movie ${id}`);
            return cachedMovie;
        }

        // Fetch from API
        const response = await axios.get(`${SPRING_API}/movies/${id}`);
        const movieDTO = response.data;

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

        cache.set(cacheKey, transformedMovie);
        return transformedMovie;

    } catch (error) {
        console.error(`Failed to fetch movie ${id}:`, error);
        throw error;
    }
};

const fetchReviewsByMovieId = async (movieId) => {
    try {
        const response = await axios.get(`${MONGO_API}/reviews?movieId=${movieId}`, { timeout: 5000 });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Server responded with ${error.response.status}`);
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('Request setup error');
        }
    }
};

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

        // Cache result
        cache.set(cacheKey, result);
        return result;

    } catch (error) {
        console.error(`Failed to fetch ${type} movies:`, error);
        throw error;
    }
};

/*const searchMoviesPaginated = async (query, page = 0, size = 10) => {
    const cacheKey = `movies_search_${query}_${page}_${size}`;

    try {
        // Check cache first
        const cachedData = cache.get(cacheKey);
        if (cachedData) return cachedData;

        // Make request to search endpoint
        const response = await axios.get(`${SPRING_API}/movies/search/title`, {
            params: {
                title: query,
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
            description: movieDTO.description || '',
            minute: movieDTO.minute || 0,
            rating: movieDTO.rating || 'N/A',
            /**
             * actors: movieDTO.actors || [],
             * genres: movieDTO.genres || [],
             * languages: movieDTO.languages || [],
             * hasOscar: movieDTO.hasOscar || false

        }));

        const result = {
            content: transformedMovies,
            totalPages: pageData.totalPages,
            totalElements: pageData.totalElements
        };

        // Cache result
        cache.set(cacheKey, result);
        return result;

    } catch (error) {
        console.error('Failed to search movies:', error);
        throw error;
    }
};*/

const fetchFilteredByTitleMovies = async (title, page = 0, size = 10) => {
    const cacheKey = `filteredMovies_title_${title}_page_${page}_size_${size}`;
    const cachedMovies = cache.get(cacheKey);
    if (cachedMovies) {
        console.log('Returning cached movies');
        return cachedMovies;
    }
    try {
        const response = await axios.get(`${SPRING_API}/movies/search/title`, {
            params: {
                title: title,
                size: size,
                page: page  // Spring Data JPA pages are 0-indexed
            },
            timeout: 10000
        });
        console.log('Connection successful');
        const pageData = response.data;
        //const moviesDTO = response.data.content;

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
        /*cache.set(cacheKey, transformedMovies);
        return transformedMovies;*/

    } catch (error) {
        console.error('Failed to fetch movies:', {
            url: `${SPRING_API}/search/title?title=${title}`,
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
};

const getReviewsFromReviewsServer = async (movieTitle) => {
    try {
        if (!movieTitle || typeof movieTitle !== 'string' || movieTitle.trim() === '') {
            throw new Error('Invalid movie title for reviews');
        }
        const encodedTitle = encodeURIComponent(movieTitle.trim());
        // Use MONGO_API which is already defined in this repository
        console.log(`[ConnectorRepository] Proxying review request for "${movieTitle}" to Reviews Server: ${MONGO_API}/reviews/movies/${encodedTitle}`);
        const response = await axios.get(`${MONGO_API}/reviews/movies/${encodedTitle}`);
        console.log(`[ConnectorRepository] Received response from ReviewsServer for "${movieTitle}".`);
        return response.data; // Return the data received from the ReviewsServer
    } catch (error) {
        console.error('[ConnectorRepository ERROR] Failed to proxy review request to Reviews Server:', error.message);
        // Rethrow or return a specific error to the controller
        throw new Error(`Failed to fetch reviews from Reviews Server: ${error.message}`);
    }
};

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
        const response = await axios.get(`${SPRING_API}/genres/allGenres`, {
            timeout: 5000
        });

        const genres = response.data;

        // Cache the result
        cache.set(cacheKey, genres);
        return genres;

    } catch (error) {
        console.error('Failed to fetch genres:', {
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

const fetchFilteredByGenreMovies = async (genre, page = 0, size = 10) => {
    const cacheKey = `filteredMovies_genre_${genre}_page_${page}_size_${size}`;
    const cachedMovies = cache.get(cacheKey);
    if (cachedMovies) {
        console.log('Returning cached movies');
        return cachedMovies;
    }
    try {
        const response = await axios.get(`${SPRING_API}/movies/search/genre`, {
            params: {
                genre: genre,
                size: size,
                page: page  // Spring Data JPA pages are 0-indexed
            },
            timeout: 10000
        });
        console.log('Connection successful');
        const pageData = response.data;
        //const moviesDTO = response.data.content;

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
        /*cache.set(cacheKey, transformedMovies);
        return transformedMovies;*/

    } catch (error) {
        console.error('Failed to fetch movies:', {
            url: `${SPRING_API}/search/genre?genre=${genre}`,
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
};

const fetchFilteredByYearMovies = async (year, page = 0, size = 10) => {
    const cacheKey = `filteredMovies_year_${year}_page_${page}_size_${size}`;
    const cachedMovies = cache.get(cacheKey);
    if (cachedMovies) {
        console.log('Returning cached movies');
        return cachedMovies;
    }
    try {
        const response = await axios.get(`${SPRING_API}/movies/search/year`, {
            params: {
                year: year,
                size: size,
                page: page  // Spring Data JPA pages are 0-indexed
            },
            timeout: 10000
        });
        console.log('Connection successful');
        const pageData = response.data;
        //const moviesDTO = response.data.content;

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
        /*cache.set(cacheKey, transformedMovies);
        return transformedMovies;*/

    } catch (error) {
        console.error('Failed to fetch movies:', {
            url: `${SPRING_API}/search/genre?year=${year}`,
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
};

const fetchFilteredByLanguageMovies = async (language, page = 0, size = 10) => {
    const cacheKey = `filteredMovies_language_${language}_page_${page}_size_${size}`;
    const cachedMovies = cache.get(cacheKey);
    if (cachedMovies) {
        console.log('Returning cached movies');
        return cachedMovies;
    }
    try {
        const response = await axios.get(`${SPRING_API}/movies/search/language`, {
            params: {
                language: language,
                size: size,
                page: page  // Spring Data JPA pages are 0-indexed
            },
            timeout: 10000
        });
        console.log('Connection successful');
        const pageData = response.data;
        //const moviesDTO = response.data.content;

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
        /*cache.set(cacheKey, transformedMovies);
        return transformedMovies;*/

    } catch (error) {
        console.error('Failed to fetch movies:', {
            url: `${SPRING_API}/search/genre?genre=${genre}`,
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
};

export default {
    fetchMovieById,
    fetchReviewsByMovieId,
    fetchMoviesPaginated,
    getReviewsFromReviewsServer,
    //searchMoviesPaginated,
    // fetchAllMovies,
    fetchFilteredByTitleMovies,
    fetchAllGenres,
    fetchFilteredByGenreMovies,
    fetchFilteredByYearMovies,
    fetchFilteredByLanguageMovies
};