import ConnectorRepository from './ConnectorRepository.js';

const getAllReviews = async () => { /* ... */ };

const getAllMovies = async () => {
    try {
        return await ConnectorRepository.fetchAllMovies();
    } catch (error) {
        console.error('Error in getAllMovies:', error);
        throw new Error('Failed to fetch movies');
    }
};

const getFilteredByTitleMovies = async (title) => {
    try {
        return await ConnectorRepository.fetchFilteredByTitleMovies(title);
    } catch (error) {
        console.error('Error in getFilteredByTitleMovies:', error);
        throw new Error('Failed to fetch movies');
    }
};

const getMovieById = async (id) => {
    try {
        const movie = await ConnectorRepository.fetchMovieById(id);
        if (!movie) {
            throw new Error('Movie not found');
        }
        return movie;
    } catch (error) {
        console.error('Error in getMovieById:', error);
        throw new Error('Failed to fetch movie');
    }
};

const getReviewsByMovieId = async (movieId) => {
    try {
        return await ConnectorRepository.fetchReviewsByMovieId(movieId);
    } catch (error) {
        console.error('Error in getReviewsByMovieId:', error);
        throw new Error('Failed to fetch reviews');
    }
};

const getMovieWithReviews = async (movieId) => {
    try {
        return await ConnectorRepository.fetchMovieWithReviews(movieId);
    } catch (error) {
        console.error('Error in getMovieWithReviews:', error);
        throw new Error('Failed to fetch movie with reviews');
    }
};

export default {
    getAllReviews,
    getAllMovies,
    getMovieById,
    getReviewsByMovieId,
    getMovieWithReviews,
    getFilteredByTitleMovies
};