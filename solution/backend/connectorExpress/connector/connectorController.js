const express = require('express');
const router = express.Router();
const connectorService = require('./ConnectorService');

/**
 * @swagger
 * tags:
 *   name: Connector
 *   description: Connector API to fetch data from Mongo and Spring servers
 */

/**
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
 *                   director:
 *                     type: string
 *                   releaseDate:
 *                     type: string
 *                     format: date
 *               example:
 *                 - id: 1
 *                   title: "Inception"
 *                   director: "Christopher Nolan"
 *                   releaseDate: "2010-07-16"
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

module.exports = router;
