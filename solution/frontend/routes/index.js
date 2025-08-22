import express from 'express';
import axios from 'axios';

const router = express.Router();

// Constants Configuration
const MONGO_API = process.env.MONGO_SERVER_URL || 'http://localhost:3000/api';
const SPRING_API = process.env.SPRING_SERVER_URL || 'http://localhost:8080/api';








/**
 * Fetches a movie by its ID.
 */
const fetchMovieByIdInternal = async (id) => {
    try {
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

        return transformedMovie;

    } catch (error) {
        console.error(`Failed to fetch movie ${id}:`, error);
        throw error;
    }
};

/**
 * Fetches a paginated list of movies by type (recent or top-rated) with caching.
 */
const fetchMoviesPaginatedInternal = async (type, page = 0, size = 10) => {
    try {
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

        const response = await axios.get(url, {
            params: {
                page,
                size
            },
            timeout: 10000
        });

        const pageData = response.data;

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

        return result;

    } catch (error) {
        console.error(`Failed to fetch ${type} movies:`, error);
        throw error;
    }
};

/**
 * Fetches reviews for a movie from the Reviews Server (MongoDB-based).
 */
const getReviewsFromReviewsServerInternal = async (movieTitle) => {
    try {
        if (!movieTitle || typeof movieTitle !== 'string' || movieTitle.trim() === '') {
            throw new Error('Invalid movie title for reviews');
        }

        const encodedTitle = encodeURIComponent(movieTitle.trim());
        console.log(`[ConnectorController] Proxying review request for "${movieTitle}" to Reviews Server: ${MONGO_API}/reviews/movies/${encodedTitle}`);
        const response = await axios.get(`${MONGO_API}/reviews/movies/${encodedTitle}`);
        console.log(`[ConnectorController] Received response from ReviewsServer for "${movieTitle}".`);
        return response.data;
    } catch (error) {
        console.error('[ConnectorController ERROR] Failed to proxy review request to Reviews Server:', error.message);
        throw new Error(`Failed to fetch reviews from Reviews Server: ${error.message}`);
    }
};

/**
 * Fetches all genres from the Spring Boot API, with caching.
 */
const fetchAllGenresInternal = async () => {
    try {
        const response = await axios.get(`${SPRING_API}/genres/allGenres`, { timeout: 5000 });
        const genres = response.data;

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

/**
 * Supports filtered movie fetching, paginated, with caching.
 */
const supportFilteredMoviesInternal = async (filterType, filterValue, page = 0, size = 10) => {
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
            currentPage: pageData.number,
            pageSize: pageData.size
        };

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

// --- Middleware (Exported for use by routes) ---
export const validateMovieId = (req, res, next) => {
    const id = Number(req.params.id);
    console.log('[validateMovieId] req.params:', req.params);
    if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
        return res.status(400).json({
            error: 'Invalid movie ID. Must be a positive integer'
        });
    }
    req.validatedId = id;
    next();
};

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get paginated movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [recent, top-rated]
 *           default: recent
 *         description: Type of movies to retrieve (recent or top-rated)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Page number (0-indexed)
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated movie list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMovies'
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Server error
 */
router.get('/movies', async (req, res, next) => {
    console.log('[GET /movies] Entered handler');
    console.log('[GET /movies] req.query:', req.query);

    try {
        const { type = 'recent' } = req.query;
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;

        if (isNaN(page) || page < 0) {
            return res.status(400).json({ error: 'Invalid page number' });
        }
        if (isNaN(size) || size < 1 || size > 100) {
            return res.status(400).json({ error: 'Invalid page size (1-100)' });
        }
        if (type !== 'recent' && type !== 'top-rated') {
            return res.status(400).json({ error: 'Invalid type parameter' });
        }

        console.log('[GET /movies] Calling fetchMoviesPaginatedInternal');
        const result = await fetchMoviesPaginatedInternal(type, page, size);
        res.json(result);
    } catch (error) {
        console.error('[GET /movies] Error:', error.message);
        res.json({});
    }
});

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get movie details by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the movie
 *     responses:
 *       200:
 *         description: Movie details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.get('/movies/:id', validateMovieId, async (req, res, next) => {
    console.log('[GET /movies/:id] Entered handler');
    console.log('[GET /movies/:id] req.params:', req.params);

    try {
        console.log('[GET /movies/:id] Calling fetchMovieByIdInternal');
        const movie = await fetchMovieByIdInternal(req.validatedId);
        res.json(movie);
    } catch (error) {
        console.error('[GET /movies/:id] Error:', error.message);
        res.json({});
    }
});

/**
 * @swagger
 * /reviews/movies/{movie_title}:
 *   get:
 *     summary: Get reviews by movie title with validation
 *     tags: [Reviews]
 *     description: >
 *       Fetches reviews for a specified movie title after validating the parameter.
 *       Returns 400 if the movie title is missing or invalid.
 *     parameters:
 *       - name: movie_title
 *         in: path
 *         required: true
 *         description: The movie title to fetch reviews for (non-empty string).
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Reviews retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d21b4667d0d8992e610c85"
 *                   movie_title:
 *                     type: string
 *                     example: "Inception"
 *                   review_text:
 *                     type: string
 *                     example: "Amazing visual effects and story."
 *                   normalized_score:
 *                     type: number
 *                     example: 9.0
 *       '400':
 *         description: Invalid or missing movie title parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or missing movieTitle parameter"
 *       '500':
 *         description: Server error while fetching reviews.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch reviews from Reviews Server"
 */
router.get('/reviews/movies/:movie_title', async (req, res, next) => {
    console.log('[GET /reviews/movies/:movie_title] Entered handler');
    console.log('[GET /reviews/movies/:movie_title] req.params:', req.params);

    try {
        const movieTitle = req.params.movie_title;
        if (!movieTitle || typeof movieTitle !== 'string' || movieTitle.trim() === '') {
            return res.status(400).json({ error: 'Invalid or missing movieTitle parameter' });
        }

        console.log('[GET /reviews/movies/:movie_title] Calling getReviewsFromReviewsServerInternal');
        console.log(`[ConnectorController] Received request for reviews for movie title: "${movieTitle}"`);
        const reviews = await getReviewsFromReviewsServerInternal(movieTitle.trim());
        res.json(reviews);
    } catch (error) {
        console.error('[GET /reviews/movies/:movie_title] Error:', error.message);
        res.json({});
    }
});

/**
 * @swagger
 * /filteredMovies/{title}:
 *   get:
 *     summary: Get filtered movies by title with pagination
 *     description: Retrieve a paginated list of movies that match the given title.
 *     tags: [Movies]
 *     parameters:
 *       - name: title
 *         in: path
 *         required: true
 *         description: The title (or partial title) of the movie to search for
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number for pagination (defaults to 0)
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *       - name: size
 *         in: query
 *         required: false
 *         description: Number of results per page (defaults to 10)
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *     responses:
 *       '200':
 *         description: A list of filtered movies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMovies'
 *       '400':
 *         description: Missing or invalid title parameter
 *       '500':
 *         description: Internal server error
 */
router.get('/filteredMovies/:title', async (req, res, next) => {
    console.log('[GET /filteredMovies/:title] Entered handler');
    console.log('[GET /filteredMovies/:title] req.params:', req.params);
    console.log('[GET /filteredMovies/:title] req.query:', req.query);

    try {
        const title = req.params.title;
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;

        if (!title) {
            return res.status(400).json({ error: 'Title query parameter is required.' });
        }

        console.log('[GET /filteredMovies/:title] Calling supportFilteredMoviesInternal for title');
        let movies = await supportFilteredMoviesInternal('title', title, page, size);
        res.json(movies);
    } catch (error) {
        console.error('[GET /filteredMovies/:title] Error:', error.message);
        res.json({});
    }
});

/**
 * @swagger
 * /filteredByGenreMovies/{genre}:
 *   get:
 *     summary: Get movies filtered by genre
 *     tags: [Movies]
 *     parameters:
 *       - name: genre
 *         in: path
 *         required: true
 *         description: Genre to filter movies by
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number (starting from 0)
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: size
 *         in: query
 *         required: false
 *         description: Number of results per page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of movies by genre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMovies'
 *       400:
 *         description: Genre query parameter is required
 *       500:
 *         description: Internal server error
 */
router.get('/filteredByGenreMovies/:genre', async (req, res, next) => {
    console.log('[GET /filteredByGenreMovies/:genre] Entered handler');
    console.log('[GET /filteredByGenreMovies/:genre] req.params:', req.params);
    console.log('[GET /filteredByGenreMovies/:genre] req.query:', req.query);

    try {
        const genre = req.params.genre;
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;

        if (!genre) {
            return res.status(400).json({ error: 'Genre query parameter is required.' });
        }

        console.log('[GET /filteredByGenreMovies/:genre] Calling supportFilteredMoviesInternal for genre');
        let movies = await supportFilteredMoviesInternal('genre', genre, page, size);
        res.json(movies);
    } catch (error) {
        console.error('[GET /filteredByGenreMovies/:genre] Error:', error.message);
        res.json({});
    }
});

/**
 * @swagger
 * /filteredByYearMovies/{year}:
 *   get:
 *     summary: Get movies filtered by year
 *     tags: [Movies]
 *     parameters:
 *       - name: year
 *         in: path
 *         required: true
 *         description: Year to filter movies by
 *         schema:
 *           type: integer
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number (starting from 0)
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: size
 *         in: query
 *         required: false
 *         description: Number of results per page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of movies by year
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMovies'
 *       400:
 *         description: Year parameter is required
 *       500:
 *         description: Internal server error
 */
router.get('/filteredByYearMovies/:year', async (req, res, next) => {
    console.log('[GET /filteredByYearMovies/:year] Entered handler');
    console.log('[GET /filteredByYearMovies/:year] req.params:', req.params);
    console.log('[GET /filteredByYearMovies/:year] req.query:', req.query);

    try {
        const year = req.params.year;
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;

        if (!year) {
            return res.status(400).json({ error: 'Year parameter is required.' });
        }

        console.log('[GET /filteredByYearMovies/:year] Calling supportFilteredMoviesInternal for year');
        let movies = await supportFilteredMoviesInternal('year', year, page, size);
        res.json(movies);
    } catch (error) {
        console.error('[GET /filteredByYearMovies/:year] Error:', error.message);
        res.json({});
    }
});

/**
 * @swagger
 * /filteredByLanguageMovies/{language}:
 *   get:
 *     summary: Get movies filtered by language
 *     tags: [Movies]
 *     parameters:
 *       - name: language
 *         in: path
 *         required: true
 *         description: Language to filter movies by
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number (starting from 0)
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: size
 *         in: query
 *         required: false
 *         description: Number of results per page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of movies by language
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMovies'
 *       400:
 *         description: Language parameter is required
 *       500:
 *         description: Internal server error
 */
router.get('/filteredByLanguageMovies/:language', async (req, res, next) => {
    try {
        const language = req.params.language;
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;

        console.log(`[GET] /filteredByLanguageMovies/${language} | page=${page}, size=${size}`);
        if (!language) {
            return res.status(400).json({ error: 'Language parameter is required.' });
        }

        let movies = await supportFilteredMoviesInternal('language', language, page, size);
        console.log(`[RESULT] Found ${movies.length} movie(s) for language: ${language}`);
        res.json(movies);
    } catch (error) {
        console.error(`[ERROR] Failed to fetch movies by language: ${error.message}`);
        res.json({});
    }
});

/**
 * @swagger
 * /filteredByActorMovies/{actor}:
 *   get:
 *     summary: Get paginated movies by actor
 *     description: Returns a paginated list of movies filtered by the specified actor name.
 *     tags: [Movies]
 *     parameters:
 *       - name: actor
 *         in: path
 *         required: true
 *         description: Name of the actor to filter movies by
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number (starting from 0)
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *       - name: size
 *         in: query
 *         required: false
 *         description: Number of results per page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *     responses:
 *       '200':
 *         description: A list of movies featuring the specified actor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMovies'
 *       '400':
 *         description: Missing or invalid actor parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Actor parameter is required."
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/filteredByActorMovies/:actor', async (req, res, next) => {
    try {
        const actor = req.params.actor;
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;

        if (!actor) {
            return res.status(400).json({ error: 'Actor parameter is required.' });
        }
        let movies = await supportFilteredMoviesInternal('actor', actor, page, size);
        res.json(movies);
    } catch (error) {
        res.json({});
    }
});

/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Get all available movie genres
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of genres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Internal server error
 */
router.get('/genres', async (req, res, next) => {
    try {
        console.log('[GET] /genres | Fetching all movie genres');

        const genres = await fetchAllGenresInternal();

        console.log(`[RESULT] Retrieved ${genres.length} genre(s)`);
        res.json(genres);
    } catch (error) {
        console.error(`[ERROR] Failed to fetch genres: ${error.message}`);
        res.json({});
    }
});

export default router;
