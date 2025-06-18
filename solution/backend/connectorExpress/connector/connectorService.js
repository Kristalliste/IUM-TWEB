import ConnectorRepository from './ConnectorRepository.js';

const getAllReviews = async () => {
    // Implementazione esistente
};

const getAllMovies = async () => {
    try {
        return await ConnectorRepository.fetchAllMovies();
    } catch (error) {
        console.error('Error in getAllMovies:', error);
        throw new Error('Failed to fetch movies');
    }
};

// Aggiunto metodo mancante
const getMovieById = async (id) => {
    try {
        return await ConnectorRepository.fetchMovieById(id);
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
    getMovieById, // Esportato
    getReviewsByMovieId,
    getMovieWithReviews
};