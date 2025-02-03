import express from 'express';
export const app_hour = express();
import swaggerUi from 'swagger-ui-express';
import {
  createOperationHour,
  deleteOperationHour,
  editOperationHour,
  getOperationHour,
} from '../../controllers/operation_hour.controller';

app_hour.get('/get-operation', getOperationHour);
app_hour.post('/create-operation', createOperationHour);
app_hour.put('/update-operation', editOperationHour);
app_hour.delete('/delete-operation', deleteOperationHour);

export default app_hour;
