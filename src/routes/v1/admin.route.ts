import express from 'express';
import * as admin from '../../controllers/admin.controller';
import { authentication } from '../../middlewares/authmiddleware';

const adminRoute = express.Router();
adminRoute.post('/register', admin.registerAdmin);
adminRoute.post('/login', admin.loginAdmin);
adminRoute.get('/all-request', authentication, admin.showAllRequest);
adminRoute.get('/accepted-list', authentication, admin.showAcceptedRequest);
adminRoute.get('/rejected-list', authentication, admin.showRejectedRequest);
adminRoute.get('/pending-list', authentication, admin.showPendingRequest);
adminRoute.put('/accept/:id', authentication, admin.acceptWithdraw);
adminRoute.put('/reject/:id', authentication, admin.rejectWithdraw);
export default adminRoute;
