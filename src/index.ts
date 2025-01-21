import  express from "express"
export const app = express();
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./swagger/swagger-output.json";
import { createProduct, getAllProduct } from "./controllers/product.controller";
import { upload } from "./middlewares/upload-file";
import { createStore, getAllStore } from "./controllers/store.controller";

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
    explorer: true,
    swaggerOptions: {
        persisAuthorization: true,
        displayRequestDuration: true
    }
}))

app.get("/", (req, res)=> {
    res.send("hello");
})

app.get('/users', (req, res) => {
    /* #swagger.tags = ['Users'] */
})

app.get('/cart', (req, res)=>{
    /*
        #swagger.tags = ['carts']
        #swagger.description = "to display users items"
    */
})

app.get('/couriers', (req, res)=>{
    /*
        #swagger.tags = ['couriers']
        #swagger.description = "to display courier data."
    */
})

app.get('/categories', (req, res)=>{
    /*
        #swagger.tags = ['categories']
        #swagger.description = "to display categories"
    */
})

app.post('/product', upload.single("attachments"), createProduct, (req, res)=> {
    /*
        #swagger.tags = ['product']
        #swagger.description = "to create all products"
    */
})

app.get('/product', getAllProduct, (req, res)=> {
    /*
        #swagger.tags = ['product']
        #swagger.description = "to display all products"
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
app.post('/stores', upload.fields([{name: 'logo_attachment', maxCount: 1}, {name: 'banner_attachment', maxCount: 1}]), createStore,(req, res)=>{
    /*
        #swagger.tags["stores"]
        #swagger.description = "to display all stores"
    */
})
app.get('/stores', getAllStore, (req, res)=>{
    /*
        #swagger.tags["stores"]
        #swagger.description = "to display all stores"
    */
})

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});