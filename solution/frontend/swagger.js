import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Function to set up Swagger documentation for the Express app
const swaggerSetup = (app, basePath) => {
    const swaggerDefinition = {
        openapi: '3.0.0',
        info: {
            title: 'Connector API',
            version: '1.0.0',
            description: 'API that connects MongoDB and Spring Boot servers',
        },
        servers: [
            {
                url: basePath,
            },
        ],
        paths: {
            '/movies': {
                get: {
                    summary: 'Get paginated movies',
                    tags: ['Movies'],
                    parameters: [
                        {
                            in: 'query',
                            name: 'type',
                            schema: { type: 'string', enum: ['recent', 'top-rated'], default: 'recent' },
                            description: 'Type of movies to retrieve'
                        },
                        {
                            in: 'query',
                            name: 'page',
                            schema: { type: 'integer', minimum: 0, default: 0 },
                            description: 'Page number (0-indexed)'
                        },
                        {
                            in: 'query',
                            name: 'size',
                            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                            description: 'Number of items per page'
                        }
                    ],
                    responses: {
                        200: { description: 'Paginated movie list' },
                        400: { description: 'Invalid request parameters' },
                        500: { description: 'Server error' }
                    }
                }
            },
            '/movies/{id}': {
                get: {
                    summary: 'Get movie details by ID',
                    tags: ['Movies'],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'integer' },
                            description: 'Numeric ID of the movie'
                        }
                    ],
                    responses: {
                        200: { description: 'Movie details' },
                        404: { description: 'Movie not found' },
                        500: { description: 'Server error' }
                    }
                }
            },
            '/reviews/movies/{movie_title}': {
                get: {
                    summary: 'Get reviews by movie title',
                    tags: ['Reviews'],
                    parameters: [
                        {
                            in: 'path',
                            name: 'movie_title',
                            required: true,
                            schema: { type: 'string' },
                            description: 'The movie title to fetch reviews for'
                        }
                    ],
                    responses: {
                        200: { description: 'Reviews retrieved successfully' },
                        400: { description: 'Invalid or missing movie title parameter' },
                        500: { description: 'Server error while fetching reviews' }
                    }
                }
            },
            '/filteredMovies/{title}': {
                get: {
                    summary: 'Get filtered movies by title',
                    tags: ['Movies'],
                    parameters: [
                        {
                            in: 'path',
                            name: 'title',
                            required: true,
                            schema: { type: 'string' }
                        },
                        {
                            in: 'query',
                            name: 'page',
                            schema: { type: 'integer', default: 0 }
                        },
                        {
                            in: 'query',
                            name: 'size',
                            schema: { type: 'integer', default: 10 }
                        }
                    ],
                    responses: {
                        200: { description: 'Filtered movies' }
                    }
                }
            },
            '/filteredByGenreMovies/{genre}': {
                get: {
                    summary: 'Get movies filtered by genre',
                    tags: ['Movies'],
                    parameters: [
                        {
                            in: 'path',
                            name: 'genre',
                            required: true,
                            schema: { type: 'string' }
                        },
                        {
                            in: 'query',
                            name: 'page',
                            schema: { type: 'integer', default: 0 }
                        },
                        {
                            in: 'query',
                            name: 'size',
                            schema: { type: 'integer', default: 10 }
                        }
                    ],
                    responses: {
                        200: { description: 'Movies by genre' }
                    }
                }
            },
            '/filteredByYearMovies/{year}': {
                get: {
                    summary: 'Get movies filtered by year',
                    tags: ['Movies'],
                    parameters: [
                        {
                            in: 'path',
                            name: 'year',
                            required: true,
                            schema: { type: 'integer' }
                        },
                        {
                            in: 'query',
                            name: 'page',
                            schema: { type: 'integer', default: 0 }
                        },
                        {
                            in: 'query',
                            name: 'size',
                            schema: { type: 'integer', default: 10 }
                        }
                    ],
                    responses: {
                        200: { description: 'Movies by year' }
                    }
                }
            },
            '/filteredByLanguageMovies/{language}': {
                get: {
                    summary: 'Get movies filtered by language',
                    tags: ['Movies'],
                    parameters: [
                        {
                            in: 'path',
                            name: 'language',
                            required: true,
                            schema: { type: 'string' }
                        },
                        {
                            in: 'query',
                            name: 'page',
                            schema: { type: 'integer', default: 0 }
                        },
                        {
                            in: 'query',
                            name: 'size',
                            schema: { type: 'integer', default: 10 }
                        }
                    ],
                    responses: {
                        200: { description: 'Movies by language' }
                    }
                }
            },
            '/filteredByActorMovies/{actor}': {
                get: {
                    summary: 'Get movies filtered by actor',
                    tags: ['Movies'],
                    parameters: [
                        {
                            in: 'path',
                            name: 'actor',
                            required: true,
                            schema: { type: 'string' }
                        },
                        {
                            in: 'query',
                            name: 'page',
                            schema: { type: 'integer', default: 0 }
                        },
                        {
                            in: 'query',
                            name: 'size',
                            schema: { type: 'integer', default: 10 }
                        }
                    ],
                    responses: {
                        200: { description: 'Movies by actor' }
                    }
                }
            },
            '/genres': {
                get: {
                    summary: 'Get all available movie genres',
                    tags: ['Movies'],
                    responses: {
                        200: { description: 'List of genres' },
                        500: { description: 'Internal server error' }
                    }
                }
            }
        }
    };

    const options = {
        definition: swaggerDefinition,
        apis: []
    };

    const specs = swaggerJsDoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

    console.log('Swagger documentation set up successfully');
    console.log('Available endpoints:', Object.keys(swaggerDefinition.paths));
};

export default swaggerSetup;