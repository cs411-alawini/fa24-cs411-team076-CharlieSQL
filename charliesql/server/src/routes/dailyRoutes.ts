import { Router, Request, Response } from 'express';
import { 
    updateDailyBioInfo,
    updateDailyCondInfo,
    updateDailyLifeInfo
} from '../services/database';

const router = Router();

router.post('/biometrics', async (req: Request, res: Response) => {
    const { userId, BMI, HbA1c, BloodGlucose } = req.body;
    try {
        const result = await updateDailyBioInfo(
            userId,
            new Date(),
            BMI,
            HbA1c,
            BloodGlucose
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error updating biometrics" });
    }
});

router.post('/conditions', async (req: Request, res: Response) => {
    const { userId, Stroke, HighChol, HighBP, HeartDisease, Hypertension } = req.body;
    try {
        const result = await updateDailyCondInfo(
            userId,
            new Date(),
            Number(Stroke),
            Number(HighChol),
            Number(HighBP),
            Number(HeartDisease),
            Number(Hypertension)
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error updating conditions" });
    }
});

router.post('/lifestyle', async (req: Request, res: Response) => {
    const { userId, Smoker, CheckChol, Fruits, Veggies } = req.body;
    try {
        const result = await updateDailyLifeInfo(
            userId,
            new Date(),
            Number(Smoker),
            Number(CheckChol),
            Number(Fruits),
            Number(Veggies)
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error updating lifestyle" });
    }
});

export default router; 