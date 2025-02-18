import express from 'express';
import { getUser } from '../../controllers/user.controller';
import { app } from '../..';
import { authentication } from '../../middlewares/authmiddleware';

const app_user = express.Router();

app_user.get('/', authentication, getUser);

export default app_user;
