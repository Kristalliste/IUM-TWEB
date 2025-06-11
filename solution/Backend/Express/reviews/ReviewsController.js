const express = require('express');
const router = express.Router();
const reviewsService = require('./ReviewsService');

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     responses:
 *       200:
 *         description: A list of reviews
 */
router.get('/', async (req, res, next) => {
    try {
        const reviews = await reviewsService.getAllReviews();
        res.json(reviews);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a single review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single review
 */
router.get('/:id', async (req, res, next) => {
    try {
        const review = await reviewsService.getReviewById(req.params.id);
        if (review) {
            res.json(review);
        } else {
            res.status(404).json({message: 'Review not found'});
        }
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       204:
 *         description: Review deleted
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const deleted = await reviewsService.deleteReview(req.params.id);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /reviews/{movieTitle}:
 *   get:
 *     summary: Retrieve reviews by movie title
 *     description: Returns a list of reviews matching the given movie title (case-insensitive).
 *     parameters:
 *       - in: path
 *         name: movieTitle
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie title to search for reviews.
 *     responses:
 *       200:
 *         description: A list of reviews for the specified movie title.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: No reviews found for the specified movie title.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No reviews found for the specified movie title
 *       500:
 *         description: Internal server error.
 */
router.get('/movie/:movieTitle', async (req, res, next) => {
    try {
        const movieTitle = req.params.movieTitle;
        const reviews = await reviewService.getReviewsByMovieTitle(movieTitle);
        if (reviews.length > 0) {
            res.status(200).json(reviews);
        } else {
            res.status(404).json({ message: 'No reviews found for the specified movie title' });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;