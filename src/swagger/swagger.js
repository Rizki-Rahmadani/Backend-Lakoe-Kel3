const { profile } = require("console");
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
      CreateCartsDTO: {
        type: "object",
        properties: {
          userId:{
            type:"string"
          },
          prices:{
            type:"integer"
          },
          discount:{
            type:"integer"
          },
          storesId:{
            type:"string"
          }
        },
      },
      DeleteCartsDTO:{
        type:"object",
        properties:{
          id:{
            type:"string"
          }
        }
      },
      ShowCartsbyIdDTO:{
        type:"object",
        properties:{
          id:{
            type:"string"
          }
        }
      },
      UpdateCartsDTO:{
        type:"object",
        properties:{
          id:{
            type:"string"
          },
          userId:{
            type:"string"
          },
          prices:{
            type:"integer"
          },
          discount:{
            type:"integer"
          },
          storesId:{
            type:"string"
          }
        }
      },
      CreateCartItemsDTO: {
        type: "object",
        properties: {
          qty:{
            type:"integer"
          },
          price:{
            type:"integer"
          },
          cartId:{
            type:"string"
          },
          storesId:{
            type:"string"
          },
          variantOptionValueId:{
            type:"string"
          }
        },
      },
      DeleteCartItemsDTO:{
        type:"object",
        properties:{
          id:{
            type:"string"
          }
        }
      },
      ShowCartItemsbyIdDTO:{
        type:"object",
        properties:{
          id:{
            type:"string"
          }
        }
      },
      UpdateCartItemsDTO:{
        type:"object",
        properties:{
          id:{
            type:"string"
          },
          qty:{
            type:"integer"
          },
          price:{
            type:"integer"
          },
          cartId:{
            type:"string"
          },
          storesId:{
            type:"string"
          },
          variantOptionValueId:{
            type:"string"
          }
        }
      },
      CreateCategoryDTO: {
        type: "object",
        properties: {
          name:{
            type:"string"
          },
          productId:{
            type:"string"
          }
        },
      },
      UpdateCategoryDTO: {
        type: "object",
        properties: {
          id:{
            type:"string"
          },
          name:{
            type:"string"
          },
          productId:{
            type:"string"
          }
        },
      },
      DeleteCategoryDTO: {
        type: "object",
        properties: {
          id:{
            type:"string"
          }
        },
      },
      ShowCategorybyIdDTO:{
        type:"object",
        properties:{
          id:{
            type:"string"
          }
        }
      },
      CreateLocationDTO: {
        type: "object",
        properties: {
          name:{
            type:"string"
          },
          address:{
            type:"string"
          },
          postal_code:{
            type:"string"
          },
          city_district:{
            type:"string"
          },
          longitude:{
            type:"string"
          },
          latitude:{
            type:"string"
          },
          storesId:{
            type:"string"
          },
          profilesId:{
            type:"string"
          },
          is_main_location:{
            type:"boolean"
          }
        },
      },
      UpdateLocationDTO: {
        type: "object",
        properties: {
          id:{
            type:"string"
          },
          name:{
            type:"string"
          },
          address:{
            type:"string"
          },
          postal_code:{
            type:"string"
          },
          city_district:{
            type:"string"
          },
          longitude:{
            type:"string"
          },
          latitude:{
            type:"string"
          },
          storesId:{
            type:"string"
          },
          profilesId:{
            type:"string"
          },
          is_main_location:{
            type:"boolean"
          }
        },
      },
      DeleteLocationDTO: {
        type: "object",
        properties: {
          id:{
            type:"string"
          }
        },
      },
      ShowLocationbyIdDTO:{
        type:"object",
        properties:{
          id:{
            type:"string"
          }
        }
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