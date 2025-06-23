import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
        apis: ['./connector/ConnectorController.js'],
    };

    const swaggerSpec = swaggerJsDoc(options);

    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerSetup;