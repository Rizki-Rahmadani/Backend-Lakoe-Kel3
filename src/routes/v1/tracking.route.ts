import express from 'express';
import { authentication } from '../../middlewares/authmiddleware';
import * as tracking from '../../controllers/tracking.controller';
const trackingRoute = express.Router();

trackingRoute.get('/:id', authentication, tracking.trackingStatus);

export default trackingRoute;
