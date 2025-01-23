import express from 'express';
import authRoute from './auth.route';
import roleRoute from './role.route';
import profileRoute from './profile.route';
import app_message from './message.route';
import app_store from './store.route';
import { authentication } from '../../middlewares/authmiddleware';
import app_product from './product.route';
const router = express.Router();

router.use('/role', roleRoute);
router.use('/auth', authRoute);
router.use('/profile', profileRoute);
router.use('/message', app_message);
router.use('/stores', app_store);
router.use('/product', app_product);
export default router;
