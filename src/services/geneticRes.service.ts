import { GeneticData } from "../models/geneticData.model";
import { User } from "../models/user.model";

export class GeneticResService {

    async fetchGeneticDataByUserId(userId: string): Promise<any> {

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        console.log('user', user);

        const geneticData = await GeneticData.findOne({ user_id : user._id });
        console.log('geneticData', geneticData);
        if (!geneticData) {
            throw new Error('Genetic data not found for this user');
        }
        return geneticData;
    }
}