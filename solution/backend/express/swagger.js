import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current directory name, which is necessary for a reliable path.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to set up Swagger documentation for the Express app
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
            ]
        },
        apis: [join(__dirname, 'routes', 'index.js')],
    };

    const swaggerSpec = swaggerJsDoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerSetup;