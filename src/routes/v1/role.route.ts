import express from 'express';
import * as role from '../../controllers/role.controller';
import { authentication } from '../../middlewares/authmiddleware';
const roleRoute = express.Router();
roleRoute.get('/', authentication, role.getAllRole);
roleRoute.get('/:id', authentication, role.getRoleId);
roleRoute.post('/create', authentication, role.createRole);
roleRoute.delete('/:id', authentication, role.deleteRole);

export default roleRoute;
