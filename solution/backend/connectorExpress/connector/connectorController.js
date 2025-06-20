import express from 'express';
import connectorService from './ConnectorService.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Inception"
 *         year:
 *           type: integer
 *           example: 2010
 *         posterUrl:
 *           type: string
 *           example: "https://example.com/poster.jpg"
 *         description:
 *           type: string
 *           example: "A mind-bending thriller..."
 *         rating:
 *           type: number
 *           format: float
 *           example: 8.8
 *         minute:
 *           type: number
 *           example: 148
 *         actors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Leonardo DiCaprio"]
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Sci-Fi"]
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           example: ["English"]
 *         hasOscar:
 *           type: boolean
 *           example: true
 *
 *     Review:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           example: "Roger Ebert"
 *         comment:
 *           type: string
 *           example: "An intelligent sci-fi thriller."
 *         rating:
 *           type: number
 *           example: 4.5
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2023-01-15T10:30:00Z"
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Retrieve all movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Paginated list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch movies"
 */
router.get('/movies', async (req, res) => {
    try {
        const movies = await connectorService.getAllMovies();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Movie not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch movie details"
 */
router.get('/movies/:id', async (req, res) => {
    try {
        const movie = await connectorService.getMovieById(req.params.id);

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.json(movie);
    } catch (error) {
        console.error(`Error fetching movie ${req.params.id}:`, error);
        res.status(500).json({
            error: 'Failed to fetch movie details',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /movies/{id}/reviews:
 *   get:
 *     summary: Get reviews for a movie
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Movie ID
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
 *         description: No reviews found
 *       500:
 *         description: Server error
 */
router.get('/movies/:id/reviews', async (req, res, next) => {
    try {
        const reviews = await connectorService.getReviewsByMovieId(req.params.id);
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ error: 'No reviews found' });
        }
        res.json(reviews);
    } catch (error) {
        console.error(`Error fetching reviews for movie ${req.params.id}:`, error);
        res.status(500).json({
            error: 'Failed to fetch reviews',
            details: error.message
        });
    }
});

export default router;