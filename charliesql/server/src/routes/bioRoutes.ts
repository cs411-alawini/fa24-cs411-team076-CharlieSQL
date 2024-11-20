import { Router, Request, Response } from 'express';
import { getUserBiometrics } from '../services/database';
import { BiometricsInfo } from '../models/dataTypes';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const bios = await getUserBiometrics();
        res.status(200).json(bios);
    } catch (error) {
        res.status(500).json({ message: "Error getting user biometrics"});
    }
});

export default router;