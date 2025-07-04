import express from 'express';
// Import specific handlers and middleware from the controller
import {
    validateMovieId,
    getMoviesHandler,
    getMovieByIdHandler,
    getReviewsByMovieTitleHandler,
    getFilteredMoviesByTitleHandler,
    getFilteredMoviesByGenreHandler,
    getFilteredMoviesByYearHandler,
    getFilteredMoviesByLanguageHandler,
    getFilteredMoviesByActorHandler,
    getAllGenresHandler
} from '../controllers/connectorController.js';

const router = express.Router();

// --- Swagger Components (Moved here as they describe the routes) ---
/**
 * @swagger
 * components:
 * schemas:
 * Movie:
 * type: object
 * properties:
 * id:
 * type: integer
 * title:
 * type: string
 * year:
 * type: integer
 * description:
 * type: string
 * minute:
 * type: number
 * rating:
 * type: number
 * posterUrl:
 * type: string
 * example:
 * id: 1
 * title: "Inception"
 * year: 2010
 * description: "A mind-bending thriller..."
 * minute: 148
 * rating: 8.8
 * posterUrl: "https://example.com/poster.jpg"
 * PaginatedMovies:
 * type: object
 * properties:
 * content:
 * type: array
 * items:
 * $ref: '#/components/schemas/Movie'
 * totalPages:
 * type: integer
 * totalElements:
 * type: integer
 * example:
 * content:
 * - id: 1
 * title: "Inception"
 * year: 2010
 * description: "A mind-bending thriller..."
 * minute: 148
 * rating: 8.8
 * posterUrl: "https://example.com/poster.jpg"
 * totalPages: 5
 * totalElements: 48
 * Review:
 * type: object
 * properties:
 * _id:
 * type: string
 * movie_title:
 * type: string
 * normalized_score:
 * type: number
 * review_content:
 * type: string
 * example:
 * _id: "62a1bc234f1b2c3d4e5f6789"
 * movie_title: "Inception"
 * normalized_score: 9.2
 * review_content: "Mind-blowing!"
 */

// --- Route Definitions (using imported handlers) ---

/**
 * @swagger
 * /movies:
 * get:
 * summary: Get paginated movies
 * tags: [Connector]
 * parameters:
 * - in: query
 * name: type
 * schema:
 * type: string
 * enum: [recent, top-rated]
 * default: recent
 * description: Type of movies to retrieve (recent or top-rated)
 * - in: query
 * name: page
 * schema:
 * type: integer
 * minimum: 0
 * default: 0
 * description: Page number (0-indexed)
 * - in: query
 * name: size
 * schema:
 * type: integer
 * minimum: 1
 * maximum: 100
 * default: 10
 * description: Number of items per page
 * responses:
 * 200:
 * description: Paginated movie list
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/PaginatedMovies'
 * 400:
 * description: Invalid request parameters
 * 500:
 * description: Server error
 */
router.get('/movies', getMoviesHandler);

/**
 * @swagger
 * /movies/{id}:
 * get:
 * summary: Get movie details by ID
 * tags: [Connector]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: Numeric ID of the movie
 * responses:
 * 200:
 * description: Movie details
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Movie'
 * 404:
 * description: Movie not found
 * 500:
 * description: Server error
 */
router.get('/movies/:id', validateMovieId, getMovieByIdHandler);

/**
 * @swagger
 * /reviews/movies/{movie_title}:
 * get:
 * summary: Get reviews by movie title with validation
 * description: >
 * Fetches reviews for a specified movie title after validating the parameter.
 * Returns 400 if the movie title is missing or invalid.
 * parameters:
 * - name: movie_title
 * in: path
 * required: true
 * description: The movie title to fetch reviews for (non-empty string).
 * schema:
 * type: string
 * responses:
 * '200':
 * description: Reviews retrieved successfully.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * _id:
 * type: string
 * example: "60d21b4667d0d8992e610c85"
 * movie_title:
 * type: string
 * example: "Inception"
 * review_text:
 * type: string
 * example: "Amazing visual effects and story."
 * normalized_score:
 * type: number
 * example: 9.0
 * '400':
 * description: Invalid or missing movie title parameter.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: "Invalid or missing movieTitle parameter"
 * '500':
 * description: Server error while fetching reviews.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: "Failed to fetch reviews from Reviews Server"
 */
router.get('/reviews/movies/:movie_title', getReviewsByMovieTitleHandler);


/**
 * @swagger
 * paths:
 * /filteredMovies/{title}:
 * get:
 * summary: Get filtered movies by title with pagination
 * description: Retrieve a paginated list of movies that match the given title.
 * tags:
 * - Movies
 * parameters:
 * - name: title
 * in: path
 * required: true
 * description: The title (or partial title) of the movie to search for
 * schema:
 * type: string
 * - name: page
 * in: query
 * required: false
 * description: The page number for pagination (defaults to 0)
 * schema:
 * type: integer
 * default: 0
 * minimum: 0
 * - name: size
 * in: query
 * required: false
 * description: Number of results per page (defaults to 10)
 * schema:
 * type: integer
 * default: 10
 * minimum: 1
 * responses:
 * '200':
 * description: A list of filtered movies
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * content:
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: integer
 * example: 101
 * title:
 * type: string
 * example: "The Matrix"
 * release_year:
 * type: integer
 * example: 1999
 * genre:
 * type: string
 * example: "Science Fiction"
 * totalPages:
 * type: integer
 * example: 5
 * totalElements:
 * type: integer
 * example: 50
 * currentPage:
 * type: integer
 * example: 0
 * '400':
 * description: Missing or invalid title parameter
 * '500':
 * description: Internal server error
 */
router.get('/filteredMovies/:title', getFilteredMoviesByTitleHandler);

/**
 * @swagger
 * paths:
 * /filteredByGenreMovies/{genre}:
 * get:
 * summary: Get movies filtered by genre
 * parameters:
 * - name: genre
 * in: path
 * required: true
 * description: Genre to filter movies by
 * schema:
 * type: string
 * - name: page
 * in: query
 * required: false
 * description: Page number (starting from 0)
 * schema:
 * type: integer
 * default: 0
 * - name: size
 * in: query
 * required: false
 * description: Number of results per page
 * schema:
 * type: integer
 * default: 10
 * responses:
 * 200:
 * description: List of movies by genre
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Movie'
 * 400:
 * description: Genre query parameter is required
 * 500:
 * description: Internal server error
 */
router.get('/filteredByGenreMovies/:genre', getFilteredMoviesByGenreHandler);

/**
 * @swagger
 * /filteredByYearMovies/{year}:
 * get:
 * summary: Get movies filtered by year
 * parameters:
 * - name: year
 * in: path
 * required: true
 * description: Year to filter movies by
 * schema:
 * type: integer
 * - name: page
 * in: query
 * required: false
 * description: Page number (starting from 0)
 * schema:
 * type: integer
 * default: 0
 * - name: size
 * in: query
 * required: false
 * description: Number of results per page
 * schema:
 * type: integer
 * default: 10
 * responses:
 * 200:
 * description: List of movies by year
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Movie'
 * 400:
 * description: Year parameter is required
 * 500:
 * description: Internal server error
 */
router.get('/filteredByYearMovies/:year', getFilteredMoviesByYearHandler);

/**
 * @swagger
 * /filteredByLanguageMovies/{language}:
 * get:
 * summary: Get movies filtered by language
 * parameters:
 * - name: language
 * in: path
 * required: true
 * description: Language to filter movies by
 * schema:
 * type: string
 * - name: page
 * in: query
 * required: false
 * description: Page number (starting from 0)
 * schema:
 * type: integer
 * default: 0
 * - name: size
 * in: query
 * required: false
 * description: Number of results per page
 * schema:
 * type: integer
 * default: 10
 * responses:
 * 200:
 * description: List of movies by language
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Movie'
 * 400:
 * description: Language parameter is required
 * 500:
 * description: Internal server error
 */
router.get('/filteredByLanguageMovies/:language', getFilteredMoviesByLanguageHandler);

/**
 * @swagger
 * paths:
 * /filteredByActorMovies/{actor}:
 * get:
 * summary: Get paginated movies by actor
 * description: Returns a paginated list of movies filtered by the specified actor name.
 * tags:
 * - Movies
 * parameters:
 * - name: actor
 * in: path
 * required: true
 * description: Name of the actor to filter movies by
 * schema:
 * type: string
 * - name: page
 * in: query
 * required: false
 * description: Page number (starting from 0)
 * schema:
 * type: integer
 * minimum: 0
 * default: 0
 * - name: size
 * in: query
 * required: false
 * description: Number of results per page
 * schema:
 * type: integer
 * minimum: 1
 * default: 10
 * responses:
 * '200':
 * description: A list of movies featuring the specified actor
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * title:
 * type: string
 * year:
 * type: integer
 * actors:
 * type: array
 * items:
 * type: string
 * '400':
 * description: Missing or invalid actor parameter
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: Actor parameter is required.
 * '500':
 * description: Internal server error
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 */
router.get('/filteredByActorMovies/:actor', getFilteredMoviesByActorHandler);

/**
 * @swagger
 * /genres:
 * get:
 * summary: Get all available movie genres
 * responses:
 * 200:
 * description: List of genres
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: string
 * 500:
 * description: Internal server error
 */
router.get('/genres', getAllGenresHandler);

export default router;
