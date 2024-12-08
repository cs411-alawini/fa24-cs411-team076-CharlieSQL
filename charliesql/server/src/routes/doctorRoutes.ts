import { Router, Request, Response } from 'express';
import { getDoctorView, getHighRiskPatients } from '../services/database';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        console.log(8, "Fetching doctor view and high risk patients data from database");
        const stats = await getDoctorView();
        const stats2 = await getHighRiskPatients();
        if (!stats) {
            throw new Error('Failed to fetch doctor view data from getDoctorView');
        }
        if (!stats2) {
            throw new Error('Failed to fetch doctor view data from getHighRiskPatients');
        }
        res.status(200).json({stats, stats2});
    } catch (error) {
        console.error(15, 'Error fetching doctor view:', error);
        res.status(500).json({ message: "Error fetching doctor statistics" });
    }
});

export default router; 