// Import the repository layer to interact with the data source
import ConnectorRepository from './ConnectorRepository.js';

// Fetch a paginated list of movies based on type (recent or top-rated)
const getMoviesPaginated = async (type, page, size) => {
    try {
        // Validate input parameters
        if (page < 0) throw new Error('Page number cannot be negative');
        if (size < 1 || size > 100) throw new Error('Invalid page size (1-100)');
        if (!['recent', 'top-rated'].includes(type)) {
            throw new Error('Invalid movie type');
        }

        // Delegate fetching to the repository
        return await ConnectorRepository.fetchMoviesPaginated(type, page, size);
    } catch (error) {
        console.error('Error in getMoviesPaginated:', error.message);
        throw new Error(`Failed to fetch ${type} movies: ${error.message}`);
    }
};

// Fetch a single movie by its ID
const getMovieById = async (id) => {
    try {
        const movieId = Number(id);
        // Validate the movie ID
        if (isNaN(movieId) || movieId <= 0 || !Number.isInteger(movieId)) {
            throw new Error('Invalid movie ID');
        }

        const movie = await ConnectorRepository.fetchMovieById(movieId);
        if (!movie) {
            throw new Error('Movie not found');
        }
        return movie;
    } catch (error) {
        console.error('Error in getMovieById:', error.message);
        throw new Error(`Failed to fetch movie: ${error.message}`);
    }
};

// Proxy a request to the reviews server for a given movie title
const getReviewsFromReviewsServer = async (movieTitle) => {
    try {
        console.log(`[ConnectorService] Calling ConnectorRepository to proxy review request for: "${movieTitle}"`);
        // Call the function now located in the repository
        const reviews = await ConnectorRepository.getReviewsFromReviewsServer(movieTitle);
        return reviews;
    } catch (error) {
        console.error('[ConnectorService ERROR] Error in getReviewsFromReviewsServer:', error.message);
        throw error; // Re-throw the error from the repository
    }
};

// Fetch movies filtered by title, with pagination
const getFilteredByTitleMovies = async (title, page, size) => {
    try {
        return await ConnectorRepository.fetchFilteredByTitleMovies(title, page, size);
    } catch (error) {
        console.error('Error in getFilteredByTitleMovies:', error);
        throw new Error('Failed to fetch movies by title');
    }
};

// Fetch movies filtered by genre, with pagination
const getFilteredByGenreMovies = async (genre, page, size) => {
    try {
        return await ConnectorRepository.fetchFilteredByGenreMovies(genre, page, size);
    } catch (error) {
        console.error('Error in fetchFilteredByGenreMovies:', error);
        throw new Error('Failed to fetch movies by genre');
    }
};

// Fetch movies filtered by year, with pagination
const getFilteredByYearMovies = async (year, page, size) => {
    try {
        return await ConnectorRepository.fetchFilteredByYearMovies(year, page, size);
    } catch (error) {
        console.error('Error in getFilteredByYearMovies:', error);
        throw new Error('Failed to fetch movies by year');
    }
};

// Fetch movies filtered by language, with pagination
const getFilteredByLanguageMovies = async (language, page, size) => {
    try {
        return await ConnectorRepository.fetchFilteredByLanguageMovies(language, page, size);
    } catch (error) {
        console.error('Error in getFilteredByYearMovies:', error);
        throw new Error('Failed to fetch movies by language');
    }
};

// Fetch movies filtered by actor, with pagination
const getFilteredByActorMovies = async (actor, page, size) => {
    try {
        return await ConnectorRepository.fetchFilteredByActorMovies(actor, page, size);
    } catch (error) {
        console.error('Error in getFilteredByActorMovies:', error);
        throw new Error('Failed to fetch movies by actor');
    }
};

// Fetch all available genres
const getAllGenres = async () => {
    try {
        return await ConnectorRepository.fetchAllGenres();
    } catch (error) {
        console.error('Error in fetchAllGenres:', error);
        throw new Error('Failed to fetch genres');
    }
};

// Export all service functions for use in other modules
export default {
    getMoviesPaginated,
    getMovieById,
    getReviewsFromReviewsServer,
    getFilteredByTitleMovies,
    getFilteredByGenreMovies,
    getFilteredByYearMovies,
    getAllGenres,
    getFilteredByLanguageMovies,
    getFilteredByActorMovies
};