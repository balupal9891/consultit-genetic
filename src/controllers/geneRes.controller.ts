import { GeneticResService } from "../services/geneticRes.service";
import { NextFunction, Request, Response } from "express";

const geneticResService = new GeneticResService();

export class geneticResController {
    async getGeneticData(req: any, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            console.log('user', req.user);
            const geneticData = await geneticResService.fetchGeneticDataByUserId(userId);
            if (!geneticData) {
                return res.status(404).json({ error: 'Genetic data not found for this user' });
            }
            return res.status(200).json({
                message: 'Successfully fetched genetic data',
                data: geneticData.genetic_data
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
