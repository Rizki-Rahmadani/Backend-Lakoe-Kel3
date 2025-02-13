import express from 'express';
import * as webhook from '../../controllers/webhook.controller';

const webhookRoute = express.Router();
webhookRoute.post('/biteship/tracking', webhook.webhookTracking);


export default webhookRoute;