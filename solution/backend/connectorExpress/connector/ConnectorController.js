import express from 'express';
import connectorService from './ConnectorService.js';

const router = express.Router();

// Middleware per validare gli ID
const validateMovieId = (req, res, next) => {
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
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         year:
 *           type: integer
 *         description:
 *           type: string
 *         minute:
 *           type: number
 *         rating:
 *           type: number
 *         posterUrl:
 *           type: string
 *       example:
 *         id: 1
 *         title: "Inception"
 *         year: 2010
 *         description: "A mind-bending thriller..."
 *         minute: 148
 *         rating: 8.8
 *         posterUrl: "https://example.com/poster.jpg"
 *     PaginatedMovies:
 *       type: object
 *       properties:
 *         content:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Movie'
 *         totalPages:
 *           type: integer
 *         totalElements:
 *           type: integer
 *       example:
 *         content:
 *           - id: 1
 *             title: "Inception"
 *             year: 2010
 *             description: "A mind-bending thriller..."
 *             minute: 148
 *             rating: 8.8
 *             posterUrl: "https://example.com/poster.jpg"
 *         totalPages: 5
 *         totalElements: 48
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         movie_title:
 *           type: string
 *         normalized_score:
 *           type: number
 *         review_content:
 *           type: string
 *       example:
 *         _id: "62a1bc234f1b2c3d4e5f6789"
 *         movie_title: "Inception"
 *         normalized_score: 9.2
 *         review_content: "Mind-blowing!"
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get paginated movies
 *     tags: [Connector]
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
    console.log('[GET /movies] Entered route');
    console.log('[GET /movies] req.query:', req.query);

    try {
        const { type = 'recent' } = req.query;
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;

        // Validate parameters
        if (isNaN(page) || page < 0) {
            return res.status(400).json({ error: 'Invalid page number' });
        }
        if (isNaN(size) || size < 1 || size > 100) {
            return res.status(400).json({ error: 'Invalid page size (1-100)' });
        }
        if (type !== 'recent' && type !== 'top-rated') {
            return res.status(400).json({ error: 'Invalid type parameter' });
        }

        console.log('[GET /movies] Calling connectorService.getMoviesPaginated');
        const result = await connectorService.getMoviesPaginated(type, page, size);
        res.json(result);
    } catch (error) {
        console.error('[GET /movies] Error:', error.message);
        next(error);
    }
});

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get movie details by ID
 *     tags: [Connector]
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
    console.log('[GET /movies/:id] Entered route');
    console.log('[GET /movies/:id] req.params:', req.params);

    try {
        console.log('[GET /movies/:id] Calling connectorService.getMovieById');
        const movie = await connectorService.getMovieById(req.validatedId);
        res.json(movie);
    } catch (error) {
        console.error('[GET /movies/:id] Error:', error.message);
        next(error);
    }
});

/**
 * @swagger
 * /reviews/movies/{movie_title}:
 *   get:
 *     summary: Get reviews by movie title with validation
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
    console.log('[GET /reviews/movies/:movie_title] Entered route');
    console.log('[GET /reviews/movies/:movie_title] req.params:', req.params);

    try {
        const movieTitle = req.params.movie_title;
        if (!movieTitle || typeof movieTitle !== 'string' || movieTitle.trim() === '') {
            return res.status(400).json({ error: 'Invalid or missing movieTitle parameter' });
        }

        console.log('[GET /reviews/movies/:movie_title] Calling connectorService.getReviewsFromReviewsServer');
        console.log(`[ConnectorController] Received request for reviews for movie title: "${movieTitle}"`);
        const reviews = await connectorService.getReviewsFromReviewsServer(movieTitle.trim());
        res.json(reviews);
    } catch (error) {
        console.error('[GET /reviews/movies/:movie_title] Error:', error.message);
        next(error);
    }
});


/**
 * @swagger
 * paths:
 *   /filteredMovies/{title}:
 *     get:
 *       summary: Get filtered movies by title with pagination
 *       description: Retrieve a paginated list of movies that match the given title.
 *       tags:
 *         - Movies
 *       parameters:
 *         - name: title
 *           in: path
 *           required: true
 *           description: The title (or partial title) of the movie to search for
 *           schema:
 *             type: string
 *         - name: page
 *           in: query
 *           required: false
 *           description: The page number for pagination (defaults to 0)
 *           schema:
 *             type: integer
 *             default: 0
 *             minimum: 0
 *         - name: size
 *           in: query
 *           required: false
 *           description: Number of results per page (defaults to 10)
 *           schema:
 *             type: integer
 *             default: 10
 *             minimum: 1
 *       responses:
 *         '200':
 *           description: A list of filtered movies
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   content:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 101
 *                         title:
 *                           type: string
 *                           example: "The Matrix"
 *                         release_year:
 *                           type: integer
 *                           example: 1999
 *                         genre:
 *                           type: string
 *                           example: "Science Fiction"
 *                   totalPages:
 *                     type: integer
 *                     example: 5
 *                   totalElements:
 *                     type: integer
 *                     example: 50
 *                   currentPage:
 *                     type: integer
 *                     example: 0
 *         '400':
 *           description: Missing or invalid title parameter
 *         '500':
 *           description: Internal server error
 */
router.get('/filteredMovies/:title', async (req, res, next) => {
    console.log('[GET /filteredMovies/:title] Entered route');
    console.log('[GET /filteredMovies/:title] req.params:', req.params);
    console.log('[GET /filteredMovies/:title] req.query:', req.query);

    try {
        // Get the title from the query parameters
        const title = req.params.title; // 'title' will be the value of ?title=... in the URL
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;
        console.log("hei");
        if (!title) {
            return res.status(400).json({ error: 'Title query parameter is required.' });
        }


        console.log('[GET /filteredMovies/:title] Calling connectorService.getFilteredByTitleMovies');
        let movies = await connectorService.getFilteredByTitleMovies(title, page, size);
        res.json(movies);
    } catch (error) {
        console.error('[GET /filteredMovies/:title] Error:', error.message);
        next(error);
    }
});

/**
 * @swagger
 * paths:
 *   /filteredByGenreMovies/{genre}:
 *     get:
 *       summary: Get movies filtered by genre
 *       parameters:
 *         - name: genre
 *           in: path
 *           required: true
 *           description: Genre to filter movies by
 *           schema:
 *             type: string
 *         - name: page
 *           in: query
 *           required: false
 *           description: Page number (starting from 0)
 *           schema:
 *             type: integer
 *             default: 0
 *         - name: size
 *           in: query
 *           required: false
 *           description: Number of results per page
 *           schema:
 *             type: integer
 *             default: 10
 *       responses:
 *         200:
 *           description: List of movies by genre
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Movie'
 *         400:
 *           description: Genre query parameter is required
 *         500:
 *           description: Internal server error
 */
router.get('/filteredByGenreMovies/:genre', async (req, res, next) => {
    console.log('[GET /filteredByGenreMovies/:genre] Entered route');
    console.log('[GET /filteredByGenreMovies/:genre] req.params:', req.params);
    console.log('[GET /filteredByGenreMovies/:genre] req.query:', req.query);

    try {
        // Get the title from the query parameters
        const genre = req.params.genre; // 'title' will be the value of ?title=... in the URL
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;

        if (!genre) {
            return res.status(400).json({ error: 'Genre query parameter is required.' });
        }

        console.log('[GET /filteredByGenreMovies/:genre] Calling connectorService.getFilteredByGenreMovies');
        let movies = await connectorService.getFilteredByGenreMovies(genre, page, size);
        res.json(movies);
    } catch (error) {
        console.error('[GET /filteredByGenreMovies/:genre] Error:', error.message);
        next(error);
    }
});

/**
 * @swagger
 * /filteredByYearMovies/{year}:
 *     get:
 *       summary: Get movies filtered by year
 *       parameters:
 *         - name: year
 *           in: path
 *           required: true
 *           description: Year to filter movies by
 *           schema:
 *             type: integer
 *         - name: page
 *           in: query
 *           required: false
 *           description: Page number (starting from 0)
 *           schema:
 *             type: integer
 *             default: 0
 *         - name: size
 *           in: query
 *           required: false
 *           description: Number of results per page
 *           schema:
 *             type: integer
 *             default: 10
 *       responses:
 *         200:
 *           description: List of movies by year
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Movie'
 *         400:
 *           description: Year parameter is required
 *         500:
 *           description: Internal server error
 */
router.get('/filteredByYearMovies/:year', async (req, res, next) => {
    console.log('[GET /filteredByYearMovies/:year] Entered route');
    console.log('[GET /filteredByYearMovies/:year] req.params:', req.params);
    console.log('[GET /filteredByYearMovies/:year] req.query:', req.query);

    try {
        // Get the title from the query parameters
        const year = req.params.year; // 'title' will be the value of ?title=... in the URL
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;

        if (!year) {
            return res.status(400).json({ error: 'Year parameter is required.' });
        }

        console.log('[GET /filteredByYearMovies/:year] Calling connectorService.getFilteredByYearMovies');
        let movies = await connectorService.getFilteredByYearMovies(year, page, size);
        res.json(movies);
    } catch (error) {
        console.error('[GET /filteredByYearMovies/:year] Error:', error.message);
        next(error);
    }
});

/**
 * @swagger
 * /filteredByLanguageMovies/{language}:
 *     get:
 *       summary: Get movies filtered by language
 *       parameters:
 *         - name: language
 *           in: path
 *           required: true
 *           description: Language to filter movies by
 *           schema:
 *             type: string
 *         - name: page
 *           in: query
 *           required: false
 *           description: Page number (starting from 0)
 *           schema:
 *             type: integer
 *             default: 0
 *         - name: size
 *           in: query
 *           required: false
 *           description: Number of results per page
 *           schema:
 *             type: integer
 *             default: 10
 *       responses:
 *         200:
 *           description: List of movies by language
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Movie'
 *         400:
 *           description: Language parameter is required
 *         500:
 *           description: Internal server error
 */
router.get('/filteredByLanguageMovies/:language', async (req, res, next) => {
    try {
        // Get the title from the query parameters
        const language = req.params.language; // 'title' will be the value of ?title=... in the URL
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;

        console.log(`[GET] /filteredByLanguageMovies/${language} | page=${page}, size=${size}`);
        if (!language) {
            return res.status(400).json({ error: 'Language parameter is required.' });
        }

        let movies = await connectorService.getFilteredByLanguageMovies(language, page, size);
        console.log(`[RESULT] Found ${movies.length} movie(s) for language: ${language}`);
        res.json(movies);
    } catch (error) {
        console.error(`[ERROR] Failed to fetch movies by language: ${error.message}`);
        next(error);
    }
});

/**
 * @swagger
 * /genres:
 *     get:
 *       summary: Get all available movie genres
 *       responses:
 *         200:
 *           description: List of genres
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: string
 *         500:
 *           description: Internal server error
 */
router.get('/genres', async (req, res, next) => {
    try {
        console.log('[GET] /genres | Fetching all movie genres');

        const genres = await connectorService.getAllGenres();

        console.log(`[RESULT] Retrieved ${genres.length} genre(s)`);
        res.json(genres);
    } catch (error) {
        console.error(`[ERROR] Failed to fetch genres: ${error.message}`);
        next(error);
    }
});

export default router;
