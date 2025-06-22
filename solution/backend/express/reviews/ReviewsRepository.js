import Reviews from './Reviews.js';
import ReviewsDTO from "./ReviewsDTO.js";

const ReviewsRepository = {
    findAll: async () => {
        try {
            return await Reviews.find();
        } catch (err) {
            throw new Error('Error fetching all reviews: ' + err.message);
        }
    },

    save: async (reviewData) => {
        try {
            const review = new Reviews(reviewData);
            return await review.save();
        } catch (err) {
            throw new Error('Error saving review: ' + err.message);
        }
    },

    deleteById: async (id) => {
        try {
            return await Reviews.findByIdAndDelete(id);
        } catch (err) {
            throw new Error(`Error deleting review with id ${id}: ` + err.message);
        }
    },

    findByScore: async (score) => {
        try {
            return await Reviews.find({ normalized_score: score });
        } catch (err) {
            throw new Error(`Error fetching reviews with score ${score}: ` + err.message);
        }
    },

    findByMovieTitle: async (title) => {
        try {
            const reviews = await Reviews.find({ movie_title: new RegExp(title, 'i') });
            // Ensure reviews is an array before calling map
            if (!Array.isArray(reviews)) {
                return []; // Return an empty array if reviews is not an array
            }
            return reviews.map(review => new ReviewsDTO(review)); // Transform with DTO
        } catch (err) {
            throw new Error(`Error fetching reviews for movie title "${title}": ` + err.message);
        }
    },
};

export default ReviewsRepository;
