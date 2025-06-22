import ConnectorRepository from './ConnectorRepository.js';

const getMoviesPaginated = async (type, page, size) => {
    try {
        // Validate input parameters
        if (page < 0) throw new Error('Page number cannot be negative');
        if (size < 1 || size > 100) throw new Error('Invalid page size (1-100)');
        if (!['recent', 'top-rated'].includes(type)) {
            throw new Error('Invalid movie type');
        }

        return await ConnectorRepository.fetchMoviesPaginated(type, page, size);
    } catch (error) {
        console.error('Error in getMoviesPaginated:', error.message);
        throw new Error(`Failed to fetch ${type} movies: ${error.message}`);
    }
};

/*const searchMoviesPaginated = async (query, page, size) => {
    try {
        // Validate input parameters
        if (!query || query.trim() === '') throw new Error('Search query is required');
        if (page < 0) throw new Error('Page number cannot be negative');
        if (size < 1 || size > 100) throw new Error('Invalid page size (1-100)');

        return await ConnectorRepository.searchMoviesPaginated(query, page, size);
    } catch (error) {
        console.error('Error in searchMoviesPaginated:', error.message);
        throw new Error(`Failed to search movies: ${error.message}`);
    }
};*/

const getFilteredByTitleMovies = async (title, page, size) => {
    try {
        return await ConnectorRepository.fetchFilteredByTitleMovies(title, page, size);
    } catch (error) {
        console.error('Error in getFilteredByTitleMovies:', error);
        throw new Error('Failed to fetch movies');
    }
};

const getMovieById = async (id) => {
    try {
        // Converte l'ID in numero e valida
        const movieId = Number(id);
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

const getReviewsByMovieId = async (movieId) => {
    try {
        const id = Number(movieId);
        if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
            throw new Error('Invalid movie ID');
        }

        return await ConnectorRepository.fetchReviewsByMovieId(id);
    } catch (error) {
        console.error('Error in getReviewsByMovieId:', error.message);
        throw new Error(`Failed to fetch reviews: ${error.message}`);
    }
};

const getMovieWithReviews = async (movieId) => {
    try {
        const id = Number(movieId);
        if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
            throw new Error('Invalid movie ID');
        }

        return await ConnectorRepository.fetchMovieWithReviews(id);
    } catch (error) {
        console.error('Error in getMovieWithReviews:', error.message);
        throw new Error(`Failed to fetch movie with reviews: ${error.message}`);
    }
};

export default {
    getMoviesPaginated,
    //searchMoviesPaginated,
    getMovieById,
    getReviewsByMovieId,
    getMovieWithReviews,
    getFilteredByTitleMovies
};