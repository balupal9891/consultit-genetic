import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { IUser, User } from "../models/user.model";
import { GeneticData, IGeneticData } from "../models/geneticData.model";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { UserProfileDto } from "../dtoes/userProfile.dto";
import fs from 'fs';
import { parseCsv } from "../helper/parseCsv";
import { enrichGeneticDataWithResponses } from "../helper/addGeneticResponse";

// const geneticData = require('../assets/genetictype.json');
const userService = new UserService();
const options = { excludeExtraneousValues: true };


export class UserController {

    async getUserProfile(req: any, res: Response, next: NextFunction) {
        try {
            const email: string = req.user.email
            const user = await userService.fetchUserByEmail(email);
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }

            const userObj = user.toObject();
            userObj._id = userObj._id.toString();

            const userProfileDto = plainToInstance(UserProfileDto, userObj, options);
            const plainUser = instanceToPlain(userProfileDto);

            return res.status(200).json({
                message: 'sucessfully fetched',
                data: plainUser
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            } else {
                return res.status(500).json({ error: 'Server error' });
            }
        }
    }

    async updateUser(req: any, res: Response, next: NextFunction) {
        const userData: IUser = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        try {
            const updatedUser = await userService.updateUserInfo(userId, userData);
            // const userDto = plainToInstance(UserProfileDto, updatedUser, options);

            return res.status(200).json({ message: 'User updated'});
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            } else {
                return res.status(500).json({ error: 'Server error' });
            }
        }
    }
    
    async getGeneticConditions(req: any, res: Response, next: NextFunction) {
        // const csvFilePath = path.join(__dirname, '../assets/genetic1.csv');
        let {geneticData} = req.body || {};
        geneticData = geneticData ? JSON.parse(geneticData) : null;
        const user = await userService.fetchUserById(req.user.id);
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }

        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'CSV file is required' });
        }
        const csvFilePath = file.path;

        try {
            const geneticResoponseData = await parseCsv(csvFilePath);
            fs.unlinkSync(csvFilePath); // Clean up the uploaded file
            if (geneticResoponseData.length === 0) {
                return res.status(404).json({ error: 'No genetic conditions found' });
            }

            const enriched = enrichGeneticDataWithResponses(geneticData, geneticResoponseData);
            if(!enriched) {
                return res.status(500).json({ error: 'Error while enriching genetic data' });
            }

            // console.log('Enriched Genetic Data:', enriched);
            // const fileSavePath = path.join(__dirname, '../assets/genetic_conditions/enriched_genetic_data.json');
            // fs.writeFileSync(fileSavePath, JSON.stringify(enriched, null, 2));

            const geneticDataCreated: IGeneticData = await GeneticData.create({
                user_id: user._id,
                genetic_data: enriched.genetic_data
            });
            // console.log('Genetic Data Created:', geneticDataCreated);
            if(!geneticDataCreated) {
                return res.status(500).json({ error: 'Error while saving genetic data' });
            }

            return res.status(200).json({
                message: 'Genetic conditions fetched successfully',
                data: enriched.genetic_data
            });

        } catch (error) {
            return res.status(500).json({ error: 'Server error while fetching genetic conditions' });
        }
    }
}