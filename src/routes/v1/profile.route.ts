import express from 'express';
import * as profiles from "../../controllers/profile.controller"

const profileRoute = express.Router();
profileRoute.get('/',profiles.getAllProfile)
profileRoute.get('/:id',profiles.getProfileById)
profileRoute.post('/create',profiles.createProfile)

export default profileRoute;