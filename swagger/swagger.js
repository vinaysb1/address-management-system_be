import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Address Management system',
      version: '1.0.0',
      description: 'API documentation using Swagger/OpenAPI',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
        description: 'Local development server',
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const specs = swaggerJsdoc(options);

export default function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}