const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'HelpDesk API',
            description: 'API dokumentacija za HelpDesk aplikaciju',
            contact: {
                name: 'Enver'
            },
            servers: ['http://localhost:3000']
        }
    },
    apis: ['../routes/*.js'] // Lokacija fajlova sa API rutama
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = function(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};