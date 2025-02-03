import express from 'express';
export const app_bank = express();
import swaggerUi from 'swagger-ui-express';
import {
  createBank,
  deleteBank,
  editBank,
  getBank,
} from '../../controllers/bank.controller';

app_bank.get('/get-bank', getBank);
app_bank.post('/create-bank', createBank);
app_bank.put('/update-bank', editBank);
app_bank.delete('/delete-bank', deleteBank);

export default app_bank;
