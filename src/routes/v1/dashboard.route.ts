import express from 'express';
import * as dashboard from '../../controllers/dashboard.controller';
import { authentication } from '../../middlewares/authmiddleware';
export const dashboardRoute = express.Router();

dashboardRoute.get('/data', authentication, dashboard.getDataDashboard);
