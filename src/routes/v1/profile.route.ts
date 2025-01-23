import express from 'express';
import * as profiles from '../../controllers/profile.controller';
import { authentication } from '../../middlewares/authmiddleware';
const profileRoute = express.Router();
profileRoute.get('/', authentication, profiles.getAllProfile);
profileRoute.get('/:id', authentication, profiles.getProfileById);
profileRoute.post('/create', authentication, profiles.createProfile);

export default profileRoute;
