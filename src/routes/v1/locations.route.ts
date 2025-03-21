import express from 'express';
import * as location from '../../controllers/locations.controller';
import { authentication } from '../../middlewares/authmiddleware';
const locationRoute = express.Router();

locationRoute.post('/create', authentication, location.createLocation);
locationRoute.get('/', authentication, location.getAllLocation);
locationRoute.get('/search', authentication, location.searchLocation);
locationRoute.get('/:id', authentication, location.getLocationsById);

// locationRoute.post('/create/buyer/:product_id', location.createLocationBiteshipBuyer);
locationRoute.put('/:id', authentication, location.updateLocation);

locationRoute.delete('/:id', authentication, location.deleteLocation);
locationRoute.get('/api/provinces', location.dataProvinces);
locationRoute.get('/api/cities/:id', location.dataCities);
locationRoute.get('/api/districts/:id', location.dataDistricts);
locationRoute.get('/api/villages/:id', location.dataVillages);

export default locationRoute;
