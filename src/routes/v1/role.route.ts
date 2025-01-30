import express from 'express';
import * as role from '../../controllers/role.controller';
import { authentication } from '../../middlewares/authmiddleware';
const roleRoute = express.Router();
roleRoute.get('/', role.getAllRole);
roleRoute.get('/:id', role.getRoleId);
roleRoute.post('/create', role.createRole);
roleRoute.delete('/:id', role.deleteRole);

export default roleRoute;
