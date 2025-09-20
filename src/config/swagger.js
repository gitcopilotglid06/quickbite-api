const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QuickBite API',
      version: '1.0.0',
      description: 'Food Menu Management API for QuickBite Restaurant',
      contact: {
        name: 'QuickBite Development Team'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        MenuItem: {
          type: 'object',
          required: ['name', 'price', 'category'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the menu item'
            },
            name: {
              type: 'string',
              description: 'Name of the menu item',
              example: 'Margherita Pizza'
            },
            description: {
              type: 'string',
              description: 'Description of the menu item',
              example: 'Classic pizza with tomato sauce, mozzarella, and fresh basil'
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Price of the menu item',
              example: 12.99
            },
            category: {
              type: 'string',
              enum: ['appetizer', 'main', 'dessert', 'beverage'],
              description: 'Category of the menu item',
              example: 'main'
            },
            dietaryTag: {
              type: 'string',
              description: 'Dietary information',
              example: 'vegetarian'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string'
            },
            message: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJSDoc(options);

module.exports = specs;