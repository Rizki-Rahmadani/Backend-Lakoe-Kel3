import express from 'express';
import * as categories from '../../controllers/categories.controller';

const categoryRoute = express.Router();

categoryRoute.get('/', categories.getAllCategories);
categoryRoute.get('/:id', categories.getCategoryById);
categoryRoute.post('/create/:productId', categories.createCategories);
categoryRoute.put('/:id', categories.updateCategories);
categoryRoute.delete('/:id', categories.deleteCategory);

export default categoryRoute;
