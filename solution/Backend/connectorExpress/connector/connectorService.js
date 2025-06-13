
const getAllReviews = async () => {
    try {
        return await ConnectorRepository.fetchAllReviews();
    } catch (error) {
        console.error('Error in getAllReviews:', error);
        throw new Error('Failed to fetch reviews');
    }
};

const getAllMovies = async () => {
    try {
        return await ConnectorRepository.fetchAllMovies();
    } catch (error) {
        console.error('Error in getAllMovies:', error);
        throw new Error('Failed to fetch movies');
    }
};

module.exports = {
    getAllReviews,
    getAllMovies
};