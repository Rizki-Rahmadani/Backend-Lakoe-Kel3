import express from 'express';
import * as orders from '../../controllers/order.controller';
import { authentication } from '../../middlewares/authmiddleware';
const orderRoute = express.Router();

orderRoute.put('/update-order', orders.updateOrder);
orderRoute.post('/confirm/:id', orders.confirmDraftOrder);
orderRoute.post('/draft-order', orders.createDraftOrder);
orderRoute.post('/', authentication, orders.retrieveOrder);
export default orderRoute;
