import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerSetup = (app, basePath) => {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Reviews API',
                version: '1.0.0',
                description: 'API for managing movie reviews',
            },
            servers: [
                { url: `http://localhost:${process.env.PORT || 3000}${basePath}` }
            ],

            components: {
                schemas: {
                    Review: {
                        type: 'object',
                        properties: {
                            _id: {
                                type: 'string',
                                description: 'Unique identifier for the review'
                            },
                            rotten_tomatoes_link: {
                                type: 'string',
                                description: 'Link to the Rotten Tomatoes page'
                            },
                            movie_title: {
                                type: 'string',
                                description: 'Title of the movie'
                            },
                            critic_name: {
                                type: 'string',
                                description: 'Name of the critic'
                            },
                            top_critic: {
                                type: 'boolean',
                                description: 'Whether the critic is a top critic'
                            },
                            publisher_name: {
                                type: 'string',
                                description: 'Name of the publisher'
                            },
                            review_type: {
                                type: 'string',
                                description: 'Type of the review'
                            },
                            review_score: {
                                type: 'number',
                                description: 'Score given in the review'
                            },
                            review_date: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Date of the review'
                            },
                            review_content: {
                                type: 'string',
                                description: 'Content of the review'
                            },
                            normalized_score: {
                                type: 'number',
                                description: 'Normalized score given in the review'
                            }
                        },
                        example: {
                            rotten_tomatoes_link: "https://www.rottentomatoes.com/m/matrix",
                            movie_title: "The Matrix",
                            critic_name: "John Doe",
                            top_critic: true,
                            publisher_name: "Rotten Tomatoes",
                            review_type: "Fresh",
                            review_score: 9.5,
                            review_date: "2023-01-15T00:00:00.000Z",
                            review_content: "A groundbreaking film that redefined the genre.",
                            normalized_score: 9.5
                        }
                    }
                }
            }
        },
        apis: ['./reviews/ReviewsController.js'],
    };

    const swaggerSpec = swaggerJsDoc(options);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerSetup;