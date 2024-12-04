import { Router, Request, Response } from 'express';
import { 
    updateDailyBioInfo,
    updateDailyCondInfo,
    updateDailyLifeInfo
} from '../services/database';

const router = Router();

// Helper function to format date for MySQL
const formatDateForMySQL = (date: Date): string => {
    return date.toISOString().slice(0, 10); // Returns 'YYYY-MM-DD'
};

router.post('/biometrics', async (req: Request, res: Response) => {
    const { userId, BMI, HbA1c, BloodGlucose } = req.body;
    try {
        const formattedDate = formatDateForMySQL(new Date());
        const result = await updateDailyBioInfo(
            userId,
            formattedDate,
            BMI,
            HbA1c,
            BloodGlucose
        );
        console.log(20, "Verification of biometrics entry update:", result);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error updating biometrics" });
    }
});

router.post('/conditions', async (req: Request, res: Response) => {
    const { userId, Stroke, HighChol, HighBP, HeartDisease, Hypertension } = req.body;
    try {
        const formattedDate = formatDateForMySQL(new Date());
        const result = await updateDailyCondInfo(
            userId,
            formattedDate,
            Stroke,
            HighChol,
            HighBP,
            HeartDisease,
            Hypertension
        );
        console.log(39, "Verification of conditions entry update:", result);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error updating conditions" });
    }
});

router.post('/lifestyle', async (req: Request, res: Response) => {
    const { userId, Smoker, CheckChol, Fruits, Veggies } = req.body;
    try {
        const formattedDate = formatDateForMySQL(new Date());
        const result = await updateDailyLifeInfo(
            userId,
            formattedDate,
            Smoker,
            CheckChol,
            Fruits,
            Veggies
        );
        console.log(57, "Verification of lifestyle entry update:", result);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error updating lifestyle" });
    }
});

export default router; 