import express from 'express';
import reviewsService from './ReviewsService.js';

const router = express.Router();

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
 * paths:
 *   /movies/{movie_title}:
 *     get:
 *       summary: Get reviews by movie title
 *       description: Retrieve all reviews associated with the specified movie title.
 *       tags:
 *         - Reviews
 *       parameters:
 *         - name: movie_title
 *           in: path
 *           required: true
 *           description: Title of the movie to fetch reviews for
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: A list of reviews for the given movie title
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109ca"
 *                     reviewer:
 *                       type: string
 *                       example: "John Doe"
 *                     rating:
 *                       type: number
 *                       format: float
 *                       example: 4.5
 *                     comment:
 *                       type: string
 *                       example: "Great movie with excellent performances!"
 *                     movie_title:
 *                       type: string
 *                       example: "Inception"
 *         '400':
 *           description: Invalid movie title supplied
 *         '404':
 *           description: No reviews found for the given movie title
 *         '500':
 *           description: Internal server error
 */
router.get('/movies/:movie_title', async (req, res, next) => {
    try {
        const movieTitle = req.params.movie_title;
        console.log(`[ReviewsController] Received movie_title from request: "${movieTitle}"`);

        const reviews = await reviewsService.getReviewsByMovieTitle(movieTitle.trim());
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
});

export default router;
