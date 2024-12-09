import { Router, Request, Response } from 'express';
import { getUserEntryInfo, getUserLogs, getUserRiskAlerts, getUserIncentives, checkUserExists, getUserDiagnosis 
} from '../services/database';

const router = Router();

router.get('/:userId/:type/:date', async (req: Request, res: Response): Promise<any> => {
    const userId = parseInt(req.params.userId);
    const type = req.params.type;
    const date = req.params.date;
    
    // Validate type parameter
    const validTypes = ['biometrics', 'conditions', 'lifestyle'];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid type parameter" });
    }

    try {
        // First check if user exists
        const exists = await checkUserExists(userId);
        if (!exists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get all user information including diagnosis
        const [entries, logs, alerts, incentives, diagnosis] = await Promise.all([
            getUserEntryInfo(userId, type, date),
            getUserLogs(userId),
            getUserRiskAlerts(userId),
            getUserIncentives(userId),
            getUserDiagnosis(userId)
        ]);

        res.status(200).json({
            entries,
            logs,
            alerts,
            incentives,
            diagnosis: diagnosis?.[0]?.Diagnosis
        });
    } catch (error) {
        console.error('Error fetching user view data:', error);
        res.status(500).json({ message: "Error fetching user data" });
    }
});

export default router; 