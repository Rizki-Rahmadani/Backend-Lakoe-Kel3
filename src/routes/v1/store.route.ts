import  express from "express"
export const app_store = express();
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./swagger/swagger-output.json";

import { upload } from "../../middlewares/upload-file";
import { createStore, getAllStore } from "../../controllers/store.controller";

app_store.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
    explorer: true,
    swaggerOptions: {
        persisAuthorization: true,
        displayRequestDuration: true
    }
}))


app_store.post('/stores', upload.fields([{name: 'logo_attachment', maxCount: 1}, {name: 'banner_attachment', maxCount: 1}]), createStore,(req, res)=>{
    /*
        #swagger.tags["stores"]
        #swagger.description = "to display all stores"
    */
})


app_store.get('/stores', getAllStore, (req, res)=>{
    /*
        #swagger.tags["stores"]
        #swagger.description = "to display all stores"
    */
})

export default app_store