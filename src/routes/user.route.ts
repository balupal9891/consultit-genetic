import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateUser } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";
// import { geneResController } from "../controllers/geneRes.controller";
import { upload } from "../middlewares/multer.middleware";

const userCntrl = new UserController();
// const geneCntrl = new geneResController();

const userRoute = Router();

userRoute.get('/info',(req, res, next)=> authenticateUser(req, res, next), (req, res, next)=> userCntrl.getUserProfile(req, res, next));
userRoute.patch('/update',(req, res, next) => authenticateUser(req, res, next), (req, res, next)=> userCntrl.updateUser(req, res, next));
userRoute.post('/genetic-conditions',(req, res, next) => authenticateUser(req, res, next),upload.single('file'), (req, res, next) => userCntrl.getGeneticConditions(req, res, next));


export {userRoute};