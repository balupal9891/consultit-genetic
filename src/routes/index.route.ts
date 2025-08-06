import express from 'express';
import { authRoute } from './auth.route';
import { userRoute } from './user.route';

const route = express();

route.use('/auth', authRoute);
route.use('/user', userRoute);


export {route};