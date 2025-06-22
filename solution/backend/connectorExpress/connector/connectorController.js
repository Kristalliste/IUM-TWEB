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
 *         review_text:
 *           type: string
 *       example:
 *         _id: "62a1bc234f1b2c3d4e5f6789"
 *         movie_title: "Inception"
 *         normalized_score: 9.2
 *         review_text: "Mind-blowing!"
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

/**
 * @swagger
 * /movies/search:
 *   get:
 *     summary: Search movies by title
 *     tags: [Connector]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
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
 *         description: Paginated search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMovies'
 *       400:
 *         description: Missing or invalid parameters
 *       500:
 *         description: Server error
 */
router.get('/movies/search', async (req, res, next) => {
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
    try {
        const movie = await connectorService.getMovieById(req.validatedId);
        res.json(movie);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /movies/{id}/reviews:
 *   get:
 *     summary: Get reviews for a specific movie
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
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.get('/movies/:id/reviews', validateMovieId, async (req, res, next) => {
    try {
        const reviews = await connectorService.getReviewsByMovieId(req.validatedId);
        res.json(reviews);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /movies/{id}/full:
 *   get:
 *     summary: Get full movie details with reviews
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
 *         description: Complete movie data with reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 year:
 *                   type: integer
 *                 description:
 *                   type: string
 *                 minute:
 *                   type: number
 *                 rating:
 *                   type: number
 *                 posterUrl:
 *                   type: string
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *                 reviewCount:
 *                   type: integer
 *               example:
 *                 id: 1
 *                 title: "Inception"
 *                 year: 2010
 *                 description: "A mind-bending thriller..."
 *                 minute: 148
 *                 rating: 8.8
 *                 posterUrl: "https://example.com/poster.jpg"
 *                 reviews:
 *                   - _id: "62a1bc234f1b2c3d4e5f6789"
 *                     movie_title: "Inception"
 *                     normalized_score: 9.2
 *                     review_text: "Mind-blowing!"
 *                 reviewCount: 1
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
router.get('/movies/:id/full', validateMovieId, async (req, res, next) => {
    try {
        const movieWithReviews = await connectorService.getMovieWithReviews(req.validatedId);
        res.json(movieWithReviews);
    } catch (error) {
        next(error);
    }
});

//DA METTERE POI SWAGGER
router.get('/filteredMovies/:title', async (req, res, next) => {
    try {
        // Get the title from the query parameters
        const title = req.params.title; // 'title' will be the value of ?title=... in the URL

        if (!title) {
            // Handle case where title is not provided, if it's required by your backend
            // For example, you might want to return an error or fetch all movies
            return res.status(400).json({ error: 'Title query parameter is required.' });
        }

        const movies = await connectorService.getFilteredByTitleMovies(title);
        res.json(movies);
    } catch (error) {
        next(error);
    }
});
export default router;