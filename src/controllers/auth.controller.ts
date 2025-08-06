import { CookieOptions, NextFunction, Request, Response } from "express";
import { IUser, User } from "../models/user.model";
import { AuthService } from "../services/auth.service";
import { generateAccessAndRefreshTokens } from "../helper/jwt";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { UserDto } from "../dtoes/user.dto";
import { UserService } from "../services/user.service";


const authService = new AuthService();
const userService = new UserService();
const options = { excludeExtraneousValues: true };

export class AuthController {

    async signUp(req: Request, res: Response, next: NextFunction) {
        const userData: IUser = req.body;

        try {
            if (!userData.email || !userData.password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const isUserExists = await authService.isUserExists(userData.email);
            if (isUserExists) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const createdUser: IUser = await authService.createUser(userData);
            if (!createdUser) {
                return res.status(500).json({ error: 'Error while creating user' })
            }

            const userObj = createdUser.toObject();
            userObj._id = userObj._id.toString();

            const userDto = plainToInstance(UserDto, userObj, options);
            const plainUser = instanceToPlain(userDto);

            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(createdUser.email, next)

            return res.status(200).json({
                message: 'User created sucessfully',
                user: plainUser,
                accessToken: 'Bearer' + accessToken,
                refreshToken: 'Bearer' + refreshToken
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            } else {
                return res.status(500).json({ error: 'Server error' });
            }
        }
    }

    async signIn(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        try {
            const user = await userService.fetchUserByEmail(email);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Password not matched' });
            }

            const userObj = user.toObject();
            userObj._id = userObj._id.toString();

            const userDto = plainToInstance(UserDto, userObj, options);
            const plainUser = instanceToPlain(userDto);

            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.email, next);

            return res.status(200).json({
                message: 'User login sucessfully',
                user: plainUser,
                accessToken: accessToken,
                refreshToken: refreshToken
            });

        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            } else {
                return res.status(500).json({ error: 'Server error' });
            }
        }
    }


}