import express from 'express';
import { authentication } from '../../middlewares/authmiddleware';
import * as transaction_list from '../../controllers/transaction-list.controller';
export const transaction_listRoute = express.Router();

transaction_listRoute.get(
  '/amount',
  authentication,
  transaction_list.totalAmount,
);
transaction_listRoute.get(
  '/transaction',
  authentication,
  transaction_list.getStoreTransaction,
);
transaction_listRoute.post(
  '/request',
  authentication,
  transaction_list.createWithdraw,
);
