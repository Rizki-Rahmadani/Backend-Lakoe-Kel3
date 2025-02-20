import express from 'express';
import * as courier from '../../controllers/courier.controller';
export const courierRoute = express.Router();

courierRoute.get('/', courier.getCourier);
courierRoute.get('/seeder', courier.getCouriersSeeder);
courierRoute.post('/rates', courier.getCourierRates);
