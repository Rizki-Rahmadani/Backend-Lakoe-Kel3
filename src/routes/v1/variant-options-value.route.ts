import express from 'express';
import * as variant from '../../controllers/variants-option-values.controller';

const variantOptionValueRoutes = express.Router();
variantOptionValueRoutes.get('/', variant.getAllVariantOptionsValue);
variantOptionValueRoutes.get('/:id', variant.getVariantOptionsValueById);
variantOptionValueRoutes.post('/create/', variant.createVariantOptionsValue);
variantOptionValueRoutes.delete('/:id', variant.deleteVariantOptionsValue);
variantOptionValueRoutes.put('/:id', variant.updateVariantOptionsValue);

export default variantOptionValueRoutes;
