import express from 'express';
export const app_product = express();
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  toggleActive,
  updateProduct,
} from '../../controllers/product.controller';
import { upload } from '../../middlewares/upload-file';

app_product.post(
  '/',
  upload.single('attachments'),
  createProduct,
  (req, res) => {
    /*
        #swagger.tags = ['product']
        #swagger.description = "to create all products"
    */
  },
);

app_product.get('/', getAllProduct, (req, res) => {
  /*
        #swagger.tags = ['product']
        #swagger.description = "to display all products"
    */
});

app_product.delete('/', deleteProduct, (req, res) => {
  /*
        #swagger.tags = ['product']
        #swagger.description = "to display all products"
    */
});

app_product.put('/toggle', toggleActive, (req, res) => {
  /*
        #swagger.tags = ['product']
        #swagger.description = "to display all products"
    */
});

app_product.put(
  '/update',
  upload.single('attachments'),
  updateProduct,
  (req, res) => {
    /*
        #swagger.tags = ['product']
        #swagger.description = "to display all products"
    */
  },
);

export default app_product;
