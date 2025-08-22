import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Function to set up Swagger documentation for the Express app
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
                // Set the server URL dynamically based on environment variable or default port
                { url: `http://localhost:${process.env.PORT || 4000}${basePath}` }
            ],
        },
        // Path to the API docs for Swagger to parse
        apis: ['./connector/ConnectorController.js'],
    };

    // Generate the Swagger specification from the options above
    const swaggerSpec = swaggerJsDoc(options);

    // Serve the Swagger UI at the /api-docs endpoint
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerSetup;