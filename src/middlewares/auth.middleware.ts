import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AppError } from '../helper/customErr';


const verifyToken = (token: string): Promise<any> => {
    try {
        // Check if the token is provided
        if (!token) {
            throw new AppError("No token provided", 400);
        }
        // Ensure the JWT_SECRET environment variable is defined
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            throw new AppError(
                "JWT_SECRET is not defined in the environment variables.",
                400
            );
        }
        if (token.split(" ")[0] !== "Bearer") {
            throw new AppError("Invalid token format", 400);
        }
        const tokenToVerify = token.split(" ")[1];
        // Verify the token
        const decoded: any = jwt.verify(tokenToVerify!, secretKey);
        // console.log(decoded);

        // Ensure the email exists in the payload
        if (!decoded.id) {
            throw new AppError("Invalid token: user not found", 401);
        }
        return decoded;
    } catch (error) {
        // Handle token-specific errors from jwt.verify
        if (error instanceof jwt.JsonWebTokenError) {
            if (error.name === "TokenExpiredError") {
                throw new Error("Token expired");
            }

            throw new Error(error.message || "Invalid token");
        }

        // Log unexpected errors for debugging
        console.error("Error verifying JWT token:", error);

        // Rethrow the error for the caller to handle
        throw error;
    }
};

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers?.authorization || (req.headers?.Authorization as string);
        // const authHeader = req.cookies['access_token'];
        // console.log(authHeader)
        if (!authHeader) {
            throw new AppError('Token not provided in headers', 400);
        }

        const decoded = await verifyToken(authHeader || "");
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: error instanceof Error ? error.message : "Unauthorized access",
        });
    }
};
