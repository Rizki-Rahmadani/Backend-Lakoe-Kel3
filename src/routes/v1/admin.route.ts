import express from 'express';
import * as admin from '../../controllers/admin.controller';

const adminRoute = express.Router();
adminRoute.post('/register', admin.registerAdmin);
adminRoute.post('/login', admin.loginAdmin);

export default adminRoute;
