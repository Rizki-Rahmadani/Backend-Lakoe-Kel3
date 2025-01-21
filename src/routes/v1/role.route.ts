import express from 'express';
import * as role from "../../controllers/role.controller"

const roleRoute = express.Router();
roleRoute.get('/',role.getAllRole)
roleRoute.get('/:id',role.getRoleId)
roleRoute.post('/create',role.createRole)

export default roleRoute;