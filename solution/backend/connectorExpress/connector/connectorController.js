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
 *       example:
 *         id: 1
 *         title: "Inception"
 *         year: 2010
 *         description: "A mind-bending thriller..."
 *         minute: 148
 *         rating: 8.8
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

/**Add commentMore actions
 * @swagger
 * /reviews:
 *   get:
 *     summary: Retrieve all reviews from MongoDB server
 *     tags: [Connector]
 *     responses:
 *       200:
 *         description: List of all reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   movie_title:
 *                     type: string
 *                   normalized_score:
 *                     type: number
 *                   review_text:
 *                     type: string
 *               example:
 *                 - _id: "62a1bc234f1b2c3d4e5f6789"
 *                   movie_title: "The Matrix"
 *                   normalized_score: 8.5
 *                   review_text: "Amazing movie!"
 *       500:
 *         description: Server error
 */
router.get('/reviews', async (req, res, next) => {
    try {
        const reviews = await connectorService.getAllReviews();
        res.json(reviews);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Retrieve all movies from Spring Boot server
 *     tags: [Connector]
 *     responses:
 *       200:
 *         description: List of all movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   year:
 *                     type: integer
 *                   description:
 *                     type: string
 *                   minute:
 *                     type: number
 *                   rating:
 *                     type: number
 *               example:
 *                 - id: 1
 *                   title: "Inception"
 *                   year: 2010
 *                   description: "A mind-bending thriller..."
 *                   minute: 148
 *                   rating: 8.8
 *       500:
 *         description: Server error
 */
router.get('/movies', async (req, res, next) => {
    try {
        const movies = await connectorService.getAllMovies();
        res.json(movies);
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
 */
router.get('/movies/:id', async (req, res, next) => {
    try {
        const movie = await connectorService.getMovieById(req.params.id);
        res.json(movie);
    } catch (error) {
        next(error);
    }
});


/**Add commentMore actions
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
 */
router.get('/movies/:id/reviews', async (req, res, next) => {
    try {
        const reviews = await connectorService.getReviewsByMovieId(req.params.id);
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
 *                 director:
 *                   type: string
 *                 releaseDate:
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
 *                 director: "Christopher Nolan"
 *                 releaseDate: "2010-07-16"
 *                 reviews:
 *                   - _id: "62a1bc234f1b2c3d4e5f6789"
 *                     movie_title: "Inception"
 *                     normalized_score: 9.2
 *                     review_text: "Mind-blowing!"
 *                 reviewCount: 1
 */
router.get('/movies/:id/full', async (req, res, next) => {
    try {
        const movieWithReviews = await connectorService.getMovieWithReviews(req.params.id);
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