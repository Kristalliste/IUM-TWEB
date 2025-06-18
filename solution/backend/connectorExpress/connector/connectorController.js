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

/**
 * @swagger
 * tags:
 *   name: Connector
 *   description: Connector API to fetch data from Mongo and Spring servers
 */

// ... (altri endpoint rimangono invariati)

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

// Aggiunto endpoint mancante
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

// ... (altri endpoint rimangono invariati)

export default router;