import express from 'express';
import { getUser, getUserByStore } from '../../controllers/user.controller';
import { app } from '../..';
import { authentication } from '../../middlewares/authmiddleware';

const app_user = express.Router();

app_user.get('/', authentication, getUser);
app_user.post('/', getUserByStore);
export default app_user;
