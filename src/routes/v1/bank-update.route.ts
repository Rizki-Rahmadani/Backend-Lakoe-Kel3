import express from 'express';
import { updateData } from '../../controllers/bank-update.controller';
import { authentication } from '../../middlewares/authmiddleware';

const bankUpdateRoute = express.Router();
bankUpdateRoute.post('/:id', authentication, updateData);
// authRoute.post('/register', register);
// authRoute.post('/login', login);
// authRoute.get('/current-user', authentication, currentUser);
export default bankUpdateRoute;
