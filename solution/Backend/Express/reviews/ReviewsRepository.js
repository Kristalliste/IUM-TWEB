const Reviews = require('./Reviews');

class ReviewRepository {
    async findAll() {
        return Reviews.find();
    }

    async findById(id) {
        return Reviews.findById(id);
    }

    async delete(id) {
        return Reviews.findByIdAndDelete(id);
    }

    async findByMovieTitle(movieTitle) {
        return Reviews.find({ movie_title: { $regex: new RegExp(movieTitle, 'i') } });
    }

}

module.exports = new ReviewRepository();
