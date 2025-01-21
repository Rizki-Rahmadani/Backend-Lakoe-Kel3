const swaggerAutogen = require("swagger-autogen")({
    openapi: "3.0.0",
    autoHeaders: false,
  });

const doc = {
  info: {
    title: 'Lakoe app',
    description: 'Lakoe app is platform for trade'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ["../index.ts"];


swaggerAutogen(outputFile, routes, doc);