import express, {Request, Response} from 'express';
import 'dotenv/config';
const api_router = express.Router();
import app_product from "../routes/v1/product.route";
import app_store from "../routes/v1/store.route";
api_router.use(express.json());

api_router.use('/product', app_product);
api_router.use('/store', app_store);


export default api_router;