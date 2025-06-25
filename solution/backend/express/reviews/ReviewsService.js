import ReviewsRepository from './ReviewsRepository.js';

const ReviewsService = {
    // Fetch all reviews from the repository
    getAllReviews: async () => {
        try {
            return await ReviewsRepository.findAll();
        } catch (err) {
            throw new Error('Failed to fetch all reviews');
        }
    },

    // Create a new review with the provided data
    createReview: async (data) => {
        try {
            return await ReviewsRepository.save(data);
        } catch (err) {
            throw new Error('Failed to create review');
        }
    },

    // Delete a review by its unique identifier
    deleteReview: async (id) => {
        try {
            return await ReviewsRepository.deleteById(id);
        } catch (err) {
            throw new Error('Failed to delete review');
        }
    },

    // Retrieve reviews by the movie title
    getReviewsByMovieTitle: async (movieTitle) => {
        try {
            return await ReviewsRepository.findByMovieTitle(movieTitle);
        } catch (err) {
            throw new Error('Failed to fetch reviews by movie title');
        }
    }
};

export default ReviewsService;
