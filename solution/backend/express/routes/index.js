import express from 'express';
import reviewsController from "../controllers/reviewsController.js";

const router = express.Router();

/**
 * @swagger
 * paths:
 *   /reviews/movies/{movie_title}:
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
 *                   $ref: '#/components/schemas/Review'
 *         '400':
 *           description: Invalid movie title supplied
 *         '404':
 *           description: No reviews found for the given movie title
 *         '500':
 *           description: Internal server error
 */
router.get('/reviews/movies/:movie_title', async (req, res, next) => {
    try {
        const movieTitle = req.params.movie_title;
        const reviews = await reviewsController.getReviewsByMovieTitle(movieTitle.trim());
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error in GET /movies/:movie_title:', error.message);
        next(error);
    }
});

export default router;
