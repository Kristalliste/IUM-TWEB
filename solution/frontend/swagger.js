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
        components: {
            schemas: {
                Movie: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'Movie ID' },
                        title: { type: 'string', description: 'Movie title' },
                        year: { type: 'integer', description: 'Release year' },
                        posterUrl: { type: 'string', description: 'Movie poster URL' },
                        description: { type: 'string', description: 'Movie description' },
                        rating: { type: 'number', description: 'Movie rating' },
                        minute: { type: 'integer', description: 'Movie duration in minutes' },
                        actors: { type: 'array', items: { type: 'string' }, description: 'List of actors' },
                        genres: { type: 'array', items: { type: 'string' }, description: 'List of genres' },
                        languages: { type: 'array', items: { type: 'string' }, description: 'List of languages' },
                        hasOscar: { type: 'boolean', description: 'Whether the movie has won an Oscar' }
                    }
                },
                PaginatedMovies: {
                    type: 'object',
                    properties: {
                        content: { type: 'array', items: { $ref: '#/components/schemas/Movie' } },
                        totalPages: { type: 'integer', description: 'Total number of pages' },
                        totalElements: { type: 'integer', description: 'Total number of elements' },
                        currentPage: { type: 'integer', description: 'Current page number' },
                        pageSize: { type: 'integer', description: 'Number of items per page' }
                    }
                }
            }
        },
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
                        200: {
                            description: 'Paginated movie list',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/PaginatedMovies' }
                                }
                            }
                        },
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
                        200: {
                            description: 'Movie details',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Movie' }
                                }
                            }
                        },
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
                        200: {
                            description: 'Reviews retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                _id: { type: 'string', example: '60d21b4667d0d8992e610c85' },
                                                movie_title: { type: 'string', example: 'Inception' },
                                                review_text: { type: 'string', example: 'Amazing visual effects and story.' },
                                                normalized_score: { type: 'number', example: 9.0 }
                                            }
                                        }
                                    }
                                }
                            }
                        },
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
                            schema: { type: 'string' },
                            description: 'Title to search for'
                        },
                        {
                            in: 'query',
                            name: 'page',
                            schema: { type: 'integer', default: 0 },
                            description: 'Page number'
                        },
                        {
                            in: 'query',
                            name: 'size',
                            schema: { type: 'integer', default: 10 },
                            description: 'Page size'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Filtered movies',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/PaginatedMovies' }
                                }
                            }
                        }
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
                            schema: { type: 'string' },
                            description: 'Genre to filter by'
                        },
                        {
                            in: 'query',
                            name: 'page',
                            schema: { type: 'integer', default: 0 },
                            description: 'Page number'
                        },
                        {
                            in: 'query',
                            name: 'size',
                            schema: { type: 'integer', default: 10 },
                            description: 'Page size'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Movies by genre',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/PaginatedMovies' }
                                }
                            }
                        }
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
                            schema: { type: 'integer' },
                            description: 'Year to filter by'
                        },
                        {
                            in: 'query',
                            name: 'page',
                            schema: { type: 'integer', default: 0 },
                            description: 'Page number'
                        },
                        {
                            in: 'query',
                            name: 'size',
                            schema: { type: 'integer', default: 10 },
                            description: 'Page size'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Movies by year',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/PaginatedMovies' }
                                }
                            }
                        }
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
                            schema: { type: 'string' },
                            description: 'Language to filter by'
                        },
                        {
                            in: 'query',
                            name: 'page',
                            schema: { type: 'integer', default: 0 },
                            description: 'Page number'
                        },
                        {
                            in: 'query',
                            name: 'size',
                            schema: { type: 'integer', default: 10 },
                            description: 'Page size'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Movies by language',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/PaginatedMovies' }
                                }
                            }
                        }
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
                            schema: { type: 'string' },
                            description: 'Actor name to filter by'
                        },
                        {
                            in: 'query',
                            name: 'page',
                            schema: { type: 'integer', default: 0 },
                            description: 'Page number'
                        },
                        {
                            in: 'query',
                            name: 'size',
                            schema: { type: 'integer', default: 10 },
                            description: 'Page size'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Movies by actor',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/PaginatedMovies' }
                                }
                            }
                        }
                    }
                }
            },
            '/genres': {
                get: {
                    summary: 'Get all available movie genres',
                    tags: ['Movies'],
                    responses: {
                        200: {
                            description: 'List of genres',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { type: 'string' }
                                    }
                                }
                            }
                        },
                        500: { description: 'Internal server error' }
                    }
                }
            }
        }
    };

    // Since we're defining everything manually, we don't need to scan files
    const options = {
        definition: swaggerDefinition,
        apis: [] // Empty since we're not scanning files
    };

    const specs = swaggerJsDoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

    console.log('Swagger documentation set up successfully');
    console.log('Available endpoints:', Object.keys(swaggerDefinition.paths));
};

export default swaggerSetup;