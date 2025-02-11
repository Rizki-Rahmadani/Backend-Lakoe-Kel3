import express from 'express';
import authRoute from './auth.route';
import roleRoute from './role.route';
import profileRoute from './profile.route';

import locationRoute from './locations.route';
import app_store from './store.route';
import variantOptionRoutes from './variant-options.route';
import variantOptionValueRoutes from './variant-options-value.route';

import app_product from './product.route';

import app_bank from './bank.route';
import app_hour from './operation_hour.route';
import app_message from './message.route';
import cartsRoute from './carts.route';
import cartsitemsRoute from './carts-items.route';
import categoryRoute from './category.route';
import variantRoutes from './variants.route';
import orderRoute from './order.route';
import trackingRoute from './tracking.route';
const router = express.Router();

router.use('/role', roleRoute);
router.use('/auth', authRoute);
router.use('/profile', profileRoute);

router.use('/product', app_product);
router.use('/message', app_message);

router.use('/stores', app_store);
router.use('/bank', app_bank);
router.use('/operation-hour', app_hour);
router.use('/order', orderRoute);
router.use('/category', categoryRoute);
router.use('/variant', variantRoutes);
router.use('/variant-options', variantOptionRoutes);
router.use('/variant-option-values', variantOptionValueRoutes);
router.use('/carts', cartsRoute);
router.use('/cart-items', cartsitemsRoute);
router.use('/locations', locationRoute);
router.use('/tracking', trackingRoute);

export default router;
