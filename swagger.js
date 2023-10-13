const swaggerJsdoc = require('swagger-jsdoc');

// Define API documentation options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API',
      version: '1.0.0',
      description: 'API documentation for your Express.js application',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Adjust the base URL as needed
        description: 'Development server',
      },
    ],
  },
  apis: ['index.js'], // Replace 'app.js' with the name of your main Express application file
};

const specs = swaggerJsdoc(options);

module.exports = specs;
