import { IUser, User } from "../models/user.model";


export class AuthService {

    async createUser(newUser: IUser): Promise<IUser> {
        const user = await User.create(newUser);
        return user;
    }

    async isUserExists(email: string): Promise<boolean> {
        const user = await User.findOne({ email });
        return !!user;
    }
    
}