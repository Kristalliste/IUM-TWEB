import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
                                description: 'Review ID'
                            },
                            rotten_tomatoes_link: {
                                type: 'string',
                                description: 'Rotten Tomatoes link for the movie'
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
                                description: 'Type of review (Fresh/Rotten)'
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
                                description: 'Normalized score of the review'
                            }
                        }
                    }
                }
            }
        },
        apis: [join(__dirname, 'routes', 'index.js')],
    };

    const swaggerSpec = swaggerJsDoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerSetup;