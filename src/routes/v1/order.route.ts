import express from 'express';
import * as orders from '../../controllers/order.controller';
import { authentication } from '../../middlewares/authmiddleware';
const orderRoute = express.Router();

orderRoute.post('/add-order', orders.createDraftOrder);
orderRoute.put('/update-order', orders.updateOrder);
orderRoute.post('/confirm/:id', orders.confirmDraftOrder);
orderRoute.post('/get-email', orders.retrieveEmailOrder);
// orderRoute.post('/draft-order', orders.createDraftOrder);
orderRoute.get('/:id', orders.retrieveOrder);
orderRoute.get('/', authentication, orders.retrieveOrderByUser);
export default orderRoute;
