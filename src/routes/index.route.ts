import express from 'express';
import { authRoute } from './auth.route';
import { userRoute } from './user.route';
import { geneRoute } from './genetic.route';

const route = express();

route.use('/auth', authRoute);
route.use('/user', userRoute);
route.use('/gene', geneRoute);


export {route};