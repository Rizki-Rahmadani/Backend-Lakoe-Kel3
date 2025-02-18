import express from 'express';
import {
  login,
  register,
  currentUser,
} from '../../controllers/auth.controller';
import { authentication } from '../../middlewares/authmiddleware';

const authRoute = express.Router();
authRoute.post('/register', register);
authRoute.post('/login', login);
authRoute.get('/current-user', authentication, currentUser);
export default authRoute;
