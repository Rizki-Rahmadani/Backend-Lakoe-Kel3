import express from 'express';
import * as location from '../../controllers/locations.controller';
import { authentication } from '../../middlewares/authmiddleware';
const locationRoute = express.Router();

locationRoute.get('/', authentication, location.getAllLocation);
locationRoute.get('/:id', authentication, location.getLocationsById);
locationRoute.post(
  '/create/:productId',
  authentication,
  location.createLocations,
);
locationRoute.put('/:id', authentication, location.updateLocation);
locationRoute.delete('/:id', authentication, location.deleteLocation);

export default locationRoute;
