import express from 'express';
import * as orders from '../../controllers/order.controller';
import { authentication } from '../../middlewares/authmiddleware';
const orderRoute = express.Router();

orderRoute.post('/add-order', orders.createOrder);
orderRoute.put('/update-order', orders.updateOrder);
orderRoute.get('/:id', orders.retrieveOrder);
orderRoute.get('/', orders.confirmOrder);
export default orderRoute;
