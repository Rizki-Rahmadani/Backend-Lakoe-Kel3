import express from 'express';
export const app_transaction = express();
import swaggerUi from 'swagger-ui-express';
import createTransaction from '../../controllers/transaction.controller';

// app_transaction.post('/create-transaction', createTransaction);

app_transaction.post('/create-transaction', createTransaction);

export default app_transaction;
