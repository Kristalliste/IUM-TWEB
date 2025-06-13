const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerSetup = (app, basePath) => {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Connector API',
                version: '1.0.0',
                description: 'API that connects MongoDB and Spring Boot servers',
            },
            servers: [
                { url: `http://localhost:${process.env.PORT || 4000}${basePath}` }
            ],
        },
        apis: ['./connectorRoutes.js'],  // swagger comments path
    };

    const swaggerSpec = swaggerJsDoc(options);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerSetup;