import express from 'express';
import * as location from '../../controllers/locations.controller';
import { authentication } from '../../middlewares/authmiddleware';
const locationRoute = express.Router();

locationRoute.get('/', authentication, location.getAllLocation);
locationRoute.get('/search', authentication, location.searchLocation);
locationRoute.get('/:id', authentication, location.getLocationsById);
locationRoute.post(
  '/create/:store_id',
  authentication,
  location.createLocation,
);
// locationRoute.post('/create/buyer/:product_id', location.createLocationBiteshipBuyer);
locationRoute.put('/:id', authentication, location.updateLocation);

locationRoute.delete('/:id', authentication, location.deleteLocation);
locationRoute.get('/api/provinces', authentication, location.dataProvinces);
locationRoute.get('/api/cities/:id', authentication, location.dataCities);
locationRoute.get('/api/districts/:id', authentication, location.dataDistricts);
locationRoute.get('/api/villages/:id', authentication, location.dataVillages);

export default locationRoute;
