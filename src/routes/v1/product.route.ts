import express from 'express';
export const app_product = express();
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  search,
  toggleActive,
  updateProduct,
} from '../../controllers/product.controller';
import { upload } from '../../middlewares/upload-file';

app_product.post(
  '/create-product',
  upload.single('attachments'),
  createProduct,
);

app_product.get('/get-product', getAllProduct);

app_product.delete('/delete-product', deleteProduct);

app_product.put('/toggle-product', toggleActive);

app_product.get('/search-product', search);

app_product.put('/update-product', upload.single('attachments'), updateProduct);

export default app_product;
