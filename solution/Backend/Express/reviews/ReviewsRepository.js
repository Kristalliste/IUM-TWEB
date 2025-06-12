const Reviews = require('./Reviews');

const ReviewRepository = {
    findAll: () => Reviews.find().exec(),
    findByMovieTitle: (title) => Reviews.find({ movie_title: new RegExp(title, 'i') }).exec(),
    save: (reviewData) => new Reviews(reviewData).save(),
    deleteById: (id) => Reviews.findByIdAndDelete(id).exec(),
};

module.exports = ReviewRepository;
