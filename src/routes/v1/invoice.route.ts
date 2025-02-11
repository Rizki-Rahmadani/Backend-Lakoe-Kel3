import express from 'express';
export const app_invoice = express();
import swaggerUi from 'swagger-ui-express';
import createTransaction from '../../controllers/transaction.controller';
import { createPayment } from '../../controllers/payment.controller';
import {
  createInvoice,
  getInvoice,
} from '../../controllers/invoice.controller';

// app_transaction.post('/create-transaction', createTransaction);

app_invoice.post('/create-invoice', createInvoice);
app_invoice.get('/get-invoice', getInvoice);
export default app_invoice;
