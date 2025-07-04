import Reviews from '../models/reviews.js';
import ReviewsDTO from "../DTO/reviewsDTO.js";

/**
 * Retrieves reviews by movie title.
 * @param {String} movieTitle - Title of the movie.
 * @returns {Promise<Array>} A promise that resolves with an array of reviews for the movie or rejects with an error.
 */
async function getReviewsByMovieTitle(movieTitle) {
    console.log(`Searching for reviews with movie title: "${movieTitle}"`);
    try {
        // Regular expression for case-insensitive matching
        const reviews = await Reviews.find({ movie_title: new RegExp(movieTitle, 'i') });
        console.log(`Found ${reviews.length} reviews for movie title: "${movieTitle}"`);
        // Ensure reviews is an array before mapping to DTOs
        if (!Array.isArray(reviews)) {
            console.log("Reviews found is not an array, returning empty array.");
            return []; // Return an empty array if reviews is not an array
        }
        // Map each review to a DTO for consistent data transfer
        return reviews.map(review => new ReviewsDTO(review));
    } catch (err) {
        console.error(`Error fetching reviews for movie title "${movieTitle}": ` + err.message);
        throw new Error(`Error fetching reviews for movie title "${movieTitle}": ` + err.message);
    }
}

export default {
    getReviewsByMovieTitle
};