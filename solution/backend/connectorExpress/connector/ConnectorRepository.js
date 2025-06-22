import axios from 'axios';
import NodeCache from 'node-cache';

const MONGO_API = process.env.MONGO_SERVER_URL || 'http://localhost:3000';
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

const fetchMovieWithReviews = async (movieId) => {
    try {
        const [movie, reviews] = await Promise.all([
            fetchMovieById(movieId),
            fetchReviewsByMovieId(movieId)
        ]);

        return {
            ...movie,
            reviews,
            reviewCount: reviews.length
        };
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

const searchMoviesPaginated = async (query, page = 0, size = 10) => {
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
             */
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
};

export default {
    fetchMovieById,
    fetchReviewsByMovieId,
    fetchMovieWithReviews,
    fetchMoviesPaginated,
    searchMoviesPaginated
};