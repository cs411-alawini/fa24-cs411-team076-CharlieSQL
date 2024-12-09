import { Router, Request, Response } from 'express';
import { updateBiometricsWithRiskAlerts,updateLifestyleWithRewards
} from '../services/database';

const router = Router();

// Helper function to format date for MySQL
// const formatDateForMySQL = (date: Date): string => {
//     return date.toISOString().slice(0, 10); // Returns 'YYYY-MM-DD'
// };

// New combined route for biometrics and conditions
router.post('/biometricsAndConditions', async (req: Request, res: Response) => {
    const { 
        userId, 
        date,
        bmi, 
        hba1c, 
        bloodGlucose,
        stroke,
        highChol,
        highBP,
        heartDisease,
        hypertension
    } = req.body;

    try {
        await updateBiometricsWithRiskAlerts(
            userId,
            date,
            bmi,
            hba1c,
            bloodGlucose,
            heartDisease,
            stroke,
            highChol,
            highBP,
            hypertension
        );
        res.status(200).json({ message: "Successfully updated biometrics and conditions" });
    } catch (error) {
        console.error("Error in biometrics and conditions update:", error);
        res.status(500).json({ message: "Error updating biometrics and conditions" });
    }
});

// Updated lifestyle route to use transaction function
router.post('/lifestyle', async (req: Request, res: Response) => {
    const { userId, date, smoker, checkChol, fruits, veggies } = req.body;
    try {
        await updateLifestyleWithRewards(
            userId,
            date,
            veggies,
            fruits,
            smoker,
            checkChol
        );
        res.status(200).json({ message: "Successfully updated lifestyle info" });
    } catch (error) {
        console.error("Error in lifestyle update:", error);
        res.status(500).json({ message: "Error updating lifestyle info" });
    }
});

export default router; 