import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AppError } from './customErr';


export const generateAccessAndRefreshTokens = async (email: string, next: any) => {
    try {
        const fetchedUser = await User.findOne({email});
        if (!fetchedUser) {
            return next(
                new AppError('User not found', 404)
            );
        }

        const accessToken = await fetchedUser?.generateAccessToken();
        const refreshToken = await fetchedUser?.generateRefreshToken();
        await User.updateOne({email}, {refreshToken: refreshToken});
        // console.log('Balu',accessToken, refreshToken)
        return { accessToken, refreshToken };
    } catch (error) {
        return next(
            new AppError("Error while generating access/refresh token", 500)
        );
    }
}


