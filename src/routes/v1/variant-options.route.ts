import express from 'express';
import * as variant from '../../controllers/variant-options.controller';

const variantOptionRoutes = express.Router();
variantOptionRoutes.get('/', variant.getAllVariantOptions);
variantOptionRoutes.get('/:id', variant.getVariantOptionsById);
variantOptionRoutes.post('/create/', variant.createVariantOptions);
variantOptionRoutes.delete('/:id', variant.deleteVariantOptions);
variantOptionRoutes.put('/:id', variant.updateVariantOptions);

export default variantOptionRoutes;
