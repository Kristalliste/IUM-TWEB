import ReviewsRepository from './ReviewsRepository.js';

const ReviewsService = {
    getAllReviews: async () => {
        try {
            return await ReviewsRepository.findAll();
        } catch (err) {
            throw new Error('Failed to fetch all reviews');
        }
    },

    createReview: async (data) => {
        try {
            return await ReviewsRepository.save(data);
        } catch (err) {
            throw new Error('Failed to create review');
        }
    },

    deleteReview: async (id) => {
        try {
            return await ReviewsRepository.deleteById(id);
        } catch (err) {
            throw new Error('Failed to delete review');
        }
    },

    getReviewsByMovieTitle: async (movieTitle) => {
        try {
            return await ReviewsRepository.findByMovieTitle(movieTitle);
        } catch (err) {
            throw new Error('Failed to fetch reviews by movie title');
        }
    }
};

export default ReviewsService;
