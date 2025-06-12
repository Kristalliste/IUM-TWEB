const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

function setupSwagger(app, basePath) {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Reviews API',
                version: '1.0.0',
                description: 'API documentation for the Reviews backend',
            },
            servers: [
                {
                    url: `http://localhost:3000${basePath}`, // use dynamic basePath here
                },
            ],
            components: {
                schemas: {
                    Review: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string', example: '60d21b4667d0d8992e610c85' },
                            rotten_tomatoes_link: { type: 'string', example: 'https://www.rottentomatoes.com/m/movie_name' },
                            movie_title: { type: 'string', example: 'The Matrix' },
                            critic_name: { type: 'string', example: 'John Doe' },
                            top_critic: { type: 'boolean', example: true },
                            publisher_name: { type: 'string', example: 'Some Publisher' },
                            review_type: { type: 'string', example: 'Top Critic' },
                            review_score: { type: 'number', example: 8.5 },
                            review_date: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' },
                            review_content: { type: 'string', example: 'Great movie!' },
                            normalized_score: { type: 'number', example: 85 },
                        },
                    },
                },
            },
        },
        apis: ['./reviews/ReviewsController.js'], // path to your controller files with swagger docs
    };

    const swaggerSpec = swaggerJSDoc(options);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
