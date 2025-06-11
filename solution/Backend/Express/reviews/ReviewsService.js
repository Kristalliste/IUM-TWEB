// reviews/ReviewService.js
const reviewsRepository = require('./ReviewsRepository');

class ReviewService {
    async getAllReviews() {
        return reviewsRepository.findAll();
    }

    async getReviewById(id) {
        return reviewsRepository.findById(id);
    }

    async deleteReview(id) {
        return reviewsRepository.delete(id);
    }

    async getReviewsByMovieTitle(movieTitle) {
        console.log(`Searching for reviews with movie title: ${movieTitle}`);
        try {
            // Use the repository to find reviews by regex
            const results = await reviewsRepository.findByMovieTitle(movieTitle);
            console.log(`Found ${results.length} reviews for movie title: ${movieTitle}`);
            return results.length > 0 ? results : [];
        } catch (error) {
            console.error(`Error fetching reviews for movie title: ${movieTitle}`, error);
            throw error;
        }
    }

}

module.exports = new ReviewService();
