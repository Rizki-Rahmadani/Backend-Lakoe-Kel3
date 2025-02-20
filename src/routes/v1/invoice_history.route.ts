import express from 'express';
export const app_invoice_history = express();
import swaggerUi from 'swagger-ui-express';
import createTransaction from '../../controllers/transaction.controller';
import { createPayment } from '../../controllers/payment.controller';
import { createInvoice } from '../../controllers/invoice.controller';
import {
  createInvoiceHistory,
  updateInvoiceHistory,
} from '../../controllers/invoice_history.controller';

// app_transaction.post('/create-transaction', createTransaction);

app_invoice_history.post('/create-invoice-history', createInvoiceHistory);
app_invoice_history.put('/update-invoice-history', updateInvoiceHistory);
export default app_invoice_history;
