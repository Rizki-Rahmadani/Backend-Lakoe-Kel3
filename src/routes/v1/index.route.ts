import express from 'express';
import authRoute from './auth.route';
import roleRoute from './role.route';
import profileRoute from './profile.route';
const router = express.Router();

router.use('/role', roleRoute)
router.use('/auth', authRoute);
router.use('/profile', profileRoute)
export default router;