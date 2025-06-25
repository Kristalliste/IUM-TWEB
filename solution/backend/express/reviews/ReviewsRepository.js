import Reviews from './Reviews.js';
import ReviewsDTO from "./ReviewsDTO.js";

// Repository object for handling review-related database operations
const ReviewsRepository = {
    // Retrieve all reviews from the database
    findAll: async () => {
        try {
            return await Reviews.find();
        } catch (err) {
            throw new Error('Error fetching all reviews: ' + err.message);
        }
    },

    // Save a new review to the database
    save: async (reviewData) => {
        try {
            const review = new Reviews(reviewData);
            return await review.save();
        } catch (err) {
            throw new Error('Error saving review: ' + err.message);
        }
    },

    // Delete a review by its unique identifier
    deleteById: async (id) => {
        try {
            return await Reviews.findByIdAndDelete(id);
        } catch (err) {
            throw new Error(`Error deleting review with id ${id}: ` + err.message);
        }
    },

    // Find reviews by movie title (case-insensitive search)
    findByMovieTitle: async (title) => {
        try {
            // Use a regular expression for case-insensitive matching
            const reviews = await Reviews.find({ movie_title: new RegExp(title, 'i') });
            // Ensure reviews is an array before mapping to DTOs
            if (!Array.isArray(reviews)) {
                return []; // Return an empty array if reviews is not an array
            }
            // Map each review to a DTO for consistent data transfer
            return reviews.map(review => new ReviewsDTO(review));
        } catch (err) {
            throw new Error(`Error fetching reviews for movie title "${title}": ` + err.message);
        }
    },
};

export default ReviewsRepository;