import express from 'express';
export const app_product = express();
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  search,
  toggleActive,
  updateProduct,
  getProductbyStore,
  getProductforName,
  getProductByUrl,
  getProductWithVariants,
} from '../../controllers/product.controller';
import { upload } from '../../middlewares/upload-file';
import { authentication } from '../../middlewares/authmiddleware';
app_product.post(
  '/create-product',
  authentication,
  upload.array('attachments'),
  createProduct,
);

app_product.get('/variants/:productId', getProductWithVariants);
app_product.get('/get-product', getAllProduct);
app_product.get('/:username/:url', getProductByUrl);
app_product.get('/check-product', authentication, getProductbyStore);
app_product.get('/get-product/:username', getProductforName);
app_product.delete('/delete-product', authentication, deleteProduct);

app_product.put('/toggle-product', authentication, toggleActive);

app_product.get('/search-product', search);

app_product.put(
  '/update-product',
  authentication,
  upload.array('attachments'),
  updateProduct,
);

export default app_product;
