import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { geneticResController } from "../controllers/geneRes.controller";


const geneCntrl = new geneticResController();

const geneRoute = Router();

geneRoute.get('/genetic-res',(req, res, next)=> authenticateUser(req, res, next), (req, res, next)=> geneCntrl.getGeneticData(req, res, next));


export {geneRoute};