const ReviewRepository = require('./ReviewsRepository');

const ReviewService = {
    getAllReviews: async () => {
        return await ReviewRepository.findAll();
    },

    getReviewsByMovieTitle: async (title) => {
        return await ReviewRepository.findByMovieTitle(title);
    },

    createReview: async (data) => {
        return await ReviewRepository.save(data);
    },

    deleteReview: async (id) => {
        return await ReviewRepository.deleteById(id);
    }
};

module.exports = ReviewService;
