import express from 'express';
export const app_bank = express();
import swaggerUi from 'swagger-ui-express';
import {
  createBank,
  deleteBank,
  getBank,
  getBankByStore,
  getBankById,
} from '../../controllers/bank.controller';
import { authentication } from '../../middlewares/authmiddleware';

app_bank.get('/get-bank', getBank);
app_bank.get('/get-bank/:id', authentication, getBankById);
app_bank.get('/store-bank', authentication, getBankByStore);
app_bank.post('/create-bank', authentication, createBank);
app_bank.delete('/delete-bank/:id', authentication, deleteBank);
export default app_bank;
