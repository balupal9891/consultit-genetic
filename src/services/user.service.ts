import { IUser, User } from "../models/user.model";


export class UserService {

    async fetchUserByEmail(email: string): Promise<IUser> {
        const user = await User.findOne({
            email: email
        });

        if (!user) {
            throw new Error('User not found');
        }
        return user
    }

    async fetchUserById(userId: string): Promise<any> {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async updateUserInfo(userId: string, dataToUpdate: Partial<IUser>): Promise<any> {
        const updatedUser = await User.findByIdAndUpdate(userId, dataToUpdate, {
            new: true,
            runValidators: true
        });
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }
}