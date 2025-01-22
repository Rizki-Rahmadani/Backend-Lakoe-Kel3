import  express from "express"
export const app_product = express();
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./swagger/swagger-output.json";
import { createProduct, getAllProduct } from "../../controllers/product.controller";
import { upload } from "../../middlewares/upload-file";


app_product.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
    explorer: true,
    swaggerOptions: {
        persisAuthorization: true,
        displayRequestDuration: true
    }
}))



app_product.post('/', upload.single("attachments"), createProduct, (req, res)=> {
    /*
        #swagger.tags = ['product']
        #swagger.description = "to create all products"
    */
})

app_product.get('/', getAllProduct, (req, res)=> {
    /*
        #swagger.tags = ['product']
        #swagger.description = "to display all products"
    */
})

export default app_product
