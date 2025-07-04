/**
 * Data Transfer Object for a movie review.
 */
class ReviewDTO {
    /**
     * Creates a new ReviewDTO instance.
     * @param {Object} reviewDoc - Raw Mongoose review document.
     */
    constructor(reviewDoc) {
        /** @type {string} Unique identifier for the review */
        this.id = reviewDoc._id.toString();

        /** @type {string} Title of the movie */
        this.movieTitle = reviewDoc.movie_title;

        /** @type {string|null} Name of the critic */
        this.criticName = reviewDoc.critic_name || null;

        /** @type {boolean} Whether the critic is a top critic */
        this.topCritic = Boolean(reviewDoc.top_critic);

        /** @type {string|null} Content of the review */
        this.reviewContent = reviewDoc.review_content || null;

        /** @type {number} Normalized score given in the review */
        this.normalizedScore = Number(reviewDoc.normalized_score) || 0;
    }

    // Getters and setters (already present in your file)
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }

    getMovieTitle() {
        return this.movieTitle;
    }
    setMovieTitle(title) {
        this.movieTitle = title;
    }

    getCriticName() {
        return this.criticName;
    }
    setCriticName(name) {
        this.criticName = name;
    }

    getTopCritic() {
        return this.topCritic;
    }
    setTopCritic(isTopCritic) {
        this.topCritic = Boolean(isTopCritic);
    }

    getReviewContent() {
        return this.reviewContent;
    }
    setReviewContent(content) {
        this.reviewContent = content;
    }

    getNormalizedScore() {
        return this.normalizedScore;
    }
    setNormalizedScore(score) {
        this.normalizedScore = Number(score);
    }
}

export default ReviewDTO;