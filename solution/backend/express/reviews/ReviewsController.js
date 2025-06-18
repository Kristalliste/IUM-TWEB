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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
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
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res, next) => {
    try {
        const newReview = await reviewsService.createReview(req.body);
        res.status(201).json(newReview);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
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
 * /reviews/by-title/{movieTitle}:
 *   get:
 *     summary: Retrieve reviews by movie title
 *     parameters:
 *       - in: path
 *         name: movieTitle
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */

router.get('/by-title/:movieTitle', async (req, res, next) => {
    try {
        const movieTitle = req.params.movieTitle;
        const reviews = await reviewsService.getReviewsByMovieTitle(movieTitle);
        if (reviews.length > 0) {
            res.status(200).json(reviews);
        } else {
            res.status(404).json({ message: 'No reviews found for the specified movie title' });
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /reviews/score/{normalized_score}:
 *   get:
 *     summary: Retrieve reviews by score
 *     description: Returns a list of 200 reviews with a specific score.
 *     parameters:
 *       - in: path
 *         name: normalized_score
 *         required: true
 *         schema:
 *           type: number
 *         description: The score to search for.
 *     responses:
 *       200:
 *         description: A list of matching reviews.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: No reviews found.
 */
router.get('/score/:normalized_score', async (req, res, next) => {
    try {
        const score = parseFloat(req.params.normalized_score);
        const reviews = await reviewsService.getReviewsByScore(score);
        if (reviews.length > 0) {
            res.status(200).json(reviews);
        } else {
            res.status(404).json({ message: 'No reviews found with that score' });
        }
    } catch (err) {
        next(err);
    }
});


module.exports = router;