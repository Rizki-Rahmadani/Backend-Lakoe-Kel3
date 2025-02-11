import express from 'express';
export const app_payment = express();
import swaggerUi from 'swagger-ui-express';
import createTransaction from '../../controllers/transaction.controller';
import { createPayment } from '../../controllers/payment.controller';

// app_transaction.post('/create-transaction', createTransaction);

app_payment.post('/create-payment', createPayment);

export default app_payment;
