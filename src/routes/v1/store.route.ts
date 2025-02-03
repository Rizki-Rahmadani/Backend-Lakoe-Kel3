import express from 'express';
export const app_store = express();
import { authentication } from '../../middlewares/authmiddleware';
import { upload } from '../../middlewares/upload-file';
import {
  createStore,
  deleteStore,
  getAllStore,
  updateStore,
  getStoreByLogin,
} from '../../controllers/store.controller';

app_store.post(
  '/',
  authentication,
  upload.fields([
    { name: 'logo_attachment', maxCount: 1 },
    { name: 'banner_attachment', maxCount: 1 },
  ]),
  createStore,
  (req, res) => {
    /*
        #swagger.tags["stores"]
        #swagger.description = "to display all stores"
    */
  },
);
app_store.get('/current-store', authentication, getStoreByLogin);
app_store.get('/', getAllStore, (req, res) => {
  /*
        #swagger.tags["stores"]
        #swagger.description = "to display all stores"
    */
});

app_store.put(
  '/update',
  authentication,
  upload.fields([
    { name: 'logo_attachment', maxCount: 1 },
    { name: 'banner_attachment', maxCount: 1 },
  ]),
  updateStore,
  (req, res) => {
    /*
        #swagger.tags["stores"]
        #swagger.description = "to display all stores"
    */
  },
);
app_store.delete('/:id', authentication, deleteStore, (req, res) => {
  /*
        #swagger.tags["stores"]
        #swagger.description = "to display all stores"
    */
});

export default app_store;
