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
                    url: `http://localhost:3000${basePath}`,
                },
            ],
        },
        apis: ['./reviews/ReviewsController.js'], // path to controller files with swagger docs
    };

    const swaggerSpec = swaggerJSDoc(options);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
