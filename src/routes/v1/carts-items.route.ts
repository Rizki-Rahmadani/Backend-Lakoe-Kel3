import express from 'express';
import * as cart_item from '../../controllers/cart-items.controller';

const cartsitemsRoute = express.Router();
cartsitemsRoute.get('/', cart_item.getAllCartItems);
cartsitemsRoute.get('/:id', cart_item.getCartItemById);
cartsitemsRoute.post('/create', cart_item.createCartItem);
cartsitemsRoute.delete('/:id', cart_item.deleteCartItem);
cartsitemsRoute.put('/:id', cart_item.updateCartItem);

export default cartsitemsRoute;
