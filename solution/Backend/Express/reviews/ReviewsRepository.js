const Reviews = require('./Reviews');
const reviewLimit = 200;

const ReviewsRepository = {
    findAll: () => Reviews.find().exec(),
    findByMovieTitle: (title) => Reviews.find({ movie_title: new RegExp(title, 'i') }).exec(),
    save: (reviewData) => new Reviews(reviewData).save(),
    deleteById: (id) => Reviews.findByIdAndDelete(id).exec(),
    findByScore: (score) => Reviews.find({ normalized_score: score }).limit(reviewLimit).exec(),
};

module.exports = ReviewsRepository;
