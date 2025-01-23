import express from 'express';
import authRoute from './auth.route';
import roleRoute from './role.route';
import profileRoute from './profile.route';
import app_message from './message.route';
import app_store from './store.route';
import { authentication } from '../../middlewares/authmiddleware';
import app_product from './product.route';

import cartsRoute from './carts.route';
import cartsitemsRoute from './carts-items.route';

const router = express.Router();

router.use('/role', roleRoute);
router.use('/auth', authRoute);
router.use('/profile', profileRoute);

router.use('/message', authentication, app_message);
router.use('/stores', app_store);
router.use('/product', app_product);

router.use('/carts', cartsRoute);
router.use('/cart-items', cartsitemsRoute);

export default router;
