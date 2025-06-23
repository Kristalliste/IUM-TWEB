import express from 'express';
import connectorService from './ConnectorService.js';

const router = express.Router();

// Middleware per validare gli ID
const validateMovieId = (req, res, next) => {
    const id = Number(req.params.id);
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

        const result = await connectorService.getMoviesPaginated(type, page, size);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

/*router.get('/movies/search', async (req, res, next) => {
    try {
        const { query } = req.query;
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;

        // Validate parameters
        if (!query || query.trim() === '') {
            return res.status(400).json({ error: 'Search query is required' });
        }
        if (isNaN(page) || page < 0) {
            return res.status(400).json({ error: 'Invalid page number' });
        }
        if (isNaN(size) || size < 1 || size > 100) {
            return res.status(400).json({ error: 'Invalid page size (1-100)' });
        }

        const result = await connectorService.searchMoviesPaginated(query, page, size);
        res.json(result);
    } catch (error) {
        next(error);
    }
});*/

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
    try {
        const movie = await connectorService.getMovieById(req.validatedId);
        res.json(movie);
    } catch (error) {
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
    try {
        const movieTitle = req.params.movie_title;
        if (!movieTitle || typeof movieTitle !== 'string' || movieTitle.trim() === '') {
            return res.status(400).json({ error: 'Invalid or missing movieTitle parameter' });
        }
        console.log(`[ConnectorController] Received request for reviews for movie title: "${movieTitle}"`);
        const reviews = await connectorService.getReviewsFromReviewsServer(movieTitle.trim());
        res.json(reviews);
    } catch (error) {
        console.error('[ConnectorController ERROR] Failed to fetch reviews from Reviews Server:', error.message);
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
    try {
        // Get the title from the query parameters
        const title = req.params.title;
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;
        console.log("hei");
        if (!title) {
            return res.status(400).json({ error: 'Title query parameter is required.' });
        }
        let movies = await connectorService.getFilteredByTitleMovies(title, page, size);
        res.json(movies);
    } catch (error) {
        next(error);
    }
});

router.get('/filteredByGenreMovies/:genre', async (req, res, next) => {
    try {
        // Get the genre from the query parameters
        const genre = req.params.genre;
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;

        if (!genre) {
            return res.status(400).json({ error: 'Genre query parameter is required.' });
        }
        let movies = await connectorService.getFilteredByGenreMovies(genre, page, size);
        res.json(movies);
    } catch (error) {
        next(error);
    }
});

router.get('/filteredByYearMovies/:year', async (req, res, next) => {
    try {
        // Get the year from the query parameters
        const year = req.params.year;
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;

        if (!year) {
            return res.status(400).json({ error: 'Year parameter is required.' });
        }
        let movies = await connectorService.getFilteredByYearMovies(year, page, size);
        res.json(movies);
    } catch (error) {
        next(error);
    }
});

router.get('/filteredByLanguageMovies/:language', async (req, res, next) => {
    try {
        // Get the language from the query parameters
        const language = req.params.language;
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;

        if (!language) {
            return res.status(400).json({ error: 'Language parameter is required.' });
        }
        let movies = await connectorService.getFilteredByLanguageMovies(language, page, size);
        res.json(movies);
    } catch (error) {
        next(error);
    }
});

router.get('/filteredByActorMovies/:actor', async (req, res, next) => {
    try {
        // Get the actor from the query parameters
        const actor = req.params.actor;
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;

        if (!actor) {
            return res.status(400).json({ error: 'Actor parameter is required.' });
        }
        let movies = await connectorService.getFilteredByActorMovies(actor, page, size);
        res.json(movies);
    } catch (error) {
        next(error);
    }
});

router.get('/genres', async (req, res, next) => {
    try {
        const genres = await connectorService.getAllGenres();
        res.json(genres);
    } catch (error) {
        next(error);
    }
});

export default router;
