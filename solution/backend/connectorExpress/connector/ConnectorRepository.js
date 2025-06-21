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

        console.log(`Fetching from: ${SPRING_API}/movies/${id}`); // Debug URL
        // Fetch from API
        const response = await axios.get(`${SPRING_API}/movies/${id}`);
        const movieDTO = response.data;

        const transformedMovie = {
            id: movieDTO?.movieId || 0,
            title: movieDTO?.name || 'Unknown',
            year: movieDTO?.date ? new Date(movieDTO.date).getFullYear() : 0,
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

/**
const fetchAllMovies = async () => {
    const cacheKey = 'allMovies';
    const cachedMovies = cache.get(cacheKey);

    if (cachedMovies) {
        console.log('Returning cached movies');
        return cachedMovies;
    }

    try {
        const url = `${SPRING_API}/movies?size=1000`;
        console.log(`Fetching movies from: ${url}`);

        const response = await axios.get(url);
        console.log(`Response status: ${response.status}`);
        console.log(`Movies count: ${response.data.content.length}`);

        const movies = response.data.content;

        // AGGIUNTO posterUrl e risolto il campo rating
        const transformedMovies = movies.map(movie => ({
            id: movie.movieId,
            title: movie.name,
            year: new Date(movie.date).getFullYear(),
            posterUrl: movie.link, // Aggiunto campo posterUrl
            description: movie.description,
            minute: movie.minute,
            rating: movie.rating || 0.0 // Risolto problema rating null
        }));

        cache.set(cacheKey, transformedMovies);
        return transformedMovies;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
};*/

const fetchAllMovies = async () => {
    const cacheKey = 'allMovies';
    const cachedMovies = cache.get(cacheKey);
    if (cachedMovies) {
        console.log('Returning cached movies');
        return cachedMovies;
    }
    try {
        const response = await axios.get(`${SPRING_API}/movies?size=1000`, { timeout: 20000 });
        console.log('Connection successful');
        const moviesDTO = response.data.content;

        const transformedMovies = moviesDTO.map(movieDTO => ({
            id: movieDTO.movieId,
            title: movieDTO.name,
            year: new Date(movieDTO.date).getFullYear(),
            posterUrl: movieDTO.link || 'https://placehold.co/300x450?text=No+Image',
            description: movieDTO.description || '',
            rating: movieDTO.rating || 'N/A',
            minute: movieDTO.minute || 0,
            actors: movieDTO.actors || [],
            genres: movieDTO.genres || [],
            languages: movieDTO.languages || [],
            hasOscar: movieDTO.hasOscar || false
        }));

        cache.set(cacheKey, transformedMovies);
        return transformedMovies;

    } catch (error) {
        console.error('Failed to fetch movies:', {
            url: `${SPRING_API}/movies`,
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
};

export default {
    fetchMovieById,
    fetchReviewsByMovieId,
    fetchMovieWithReviews,
    fetchAllMovies
};