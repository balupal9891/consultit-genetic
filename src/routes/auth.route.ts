import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const authCntrl = new AuthController();

const authRoute = Router();

authRoute.post('/createuser', (req, res, next)=> authCntrl.signUp(req, res, next));
authRoute.get('/signin', (req, res, next)=> authCntrl.signIn(req, res, next));


export {authRoute};