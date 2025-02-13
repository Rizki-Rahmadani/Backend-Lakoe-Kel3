import express from 'express';
import * as orders from '../../controllers/order.controller';
import { authentication } from '../../middlewares/authmiddleware';
const orderRoute = express.Router();

orderRoute.post('/add-order', authentication, orders.createOrder);
orderRoute.get('/:id', authentication, orders.retrieveOrder);
orderRoute.get('/', authentication, orders.confirmOrder);
export default orderRoute;
