import express from 'express';
import * as carts from '../../controllers/carts.controller';

const cartsRoute = express.Router();
cartsRoute.get('/', carts.getAllCarts);
cartsRoute.get('/:id', carts.getCartById);
cartsRoute.post('/create', carts.createCart);
cartsRoute.delete('/:id', carts.deleteCart);
cartsRoute.put('/:id', carts.updateCart);

export default cartsRoute;
