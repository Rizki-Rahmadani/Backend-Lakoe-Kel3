import express from 'express';
import * as categories from '../../controllers/categories.controller';
import { authentication } from '../../middlewares/authmiddleware';
const categoryRoute = express.Router();

categoryRoute.get('/', authentication, categories.getAllCategories);
categoryRoute.get('/:id', authentication, categories.getCategoryById);
categoryRoute.post('/create', authentication, categories.createCategories);
categoryRoute.put('/:id', authentication, categories.updateCategories);
categoryRoute.delete('/:id', authentication, categories.deleteCategory);

export default categoryRoute;
