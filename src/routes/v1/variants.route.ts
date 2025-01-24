import express from 'express';
import * as variant from '../../controllers/variants.controller';

const variantRoutes = express.Router();
variantRoutes.get('/', variant.getAllVariants);
variantRoutes.get('/:id', variant.getVariantsById);
variantRoutes.post('/create/:productId', variant.createVariants);
variantRoutes.delete('/:id', variant.deleteVariant);
variantRoutes.put('/:id', variant.updateVariant);

export default variantRoutes;
