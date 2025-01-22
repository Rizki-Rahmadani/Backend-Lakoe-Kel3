const { type } = require("os");

const swaggerAutogen = require("swagger-autogen")({
    openapi: "3.0.0",
    autoHeaders: false,
  });

const doc = {
  info: {
    title: 'Lakoe app',
    description: 'Lakoe app is platform for trade'
  },
  host: 'localhost:3000',
  components: {
    "@schemas": {
      CreateRolesDTO: {
        type: "object",
        properties: {
          name:{
            type:"string"
          }
        },
      },
      DeleteRoleDTO: {
        type: "object",
        properties: {
          id:{
            type:"string"
          }
        },
      },
      GetRoleDTO:{
        type:"object",
        properties:{
          id:{
            type:"string"
          }
        }
      },
      CreateProfileDTO: {
        type: "object",
        properties: {
          user_id:{
            type:"string"
          },
          locationid:{
            type:"string"
          }
        },
      },
      LoginDTO: {
        type: "object",
        properties: {
          email: {
            type: "string",
          },
          password: {
            type: "string",
            format: "password",
          },
        },
      },
      
      RegisterDTO: {
        type: "object",
        properties: {
          fullname: {
            type: "string",
          },
          email: {
            type: "string",
          },
          phone_number: {
            type: "string",
          },
          password: {
            type: "string",
            format: "password",
          },
          
        },
      },
    },
    // securitySchemes: {
    //   bearerAuth: {
    //     type: "http",
    //     scheme: "bearer",
    //   },
    // },
  },
};

const outputFile = './swagger-output.json';
const routes = ["../index.ts"];


swaggerAutogen(outputFile, routes, doc);