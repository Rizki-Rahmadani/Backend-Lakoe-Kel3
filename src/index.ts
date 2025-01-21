import  express from "express"
export const app = express();
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./swagger/swagger-output.json";

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
    explorer: true,
    swaggerOptions: {
        persisAuthorization: true,
        displayRequestDuration: true
    }
}))



app.get('/users', (req, res) => {
    /* #swagger.tags = ['Users'] */
})

app.get('/cart', (req, res)=>{
    /*
        #swagger.tags = ['carts']
        #swagger.description = "to display users items"
    */
})

app.get('/invoice', (req, res) => {
    /* 
        #swagger.tags ['invoice']
        #swagger.description = "to get user invoice history"
    */

    /*
        #swagger.parameters['obj] = {
            in: 'body',
            description: 'user invoice.',
            required: false
        }
    */
})

app.get('/stores', (req, res)=>{
    /*
        #swagger.tags["stores"]
        #swagger.description = "to display all stores"
    */
})

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });