import express from 'express';
import authRoute from './auth.route';
import roleRoute from './role.route';
const router = express.Router();

router.use('/role', roleRoute)
router.use('/auth', authRoute);
export default router;