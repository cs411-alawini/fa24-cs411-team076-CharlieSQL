import { Router, Request, Response } from 'express';
import { 
    getQuery1,
    getQuery2,
    getQuery3,
    getQuery4
} from '../services/database';

const router = Router();

router.get('/1', async (req: Request, res: Response) => {
    try {
        const result = await getQuery1();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error executing query 1" });
    }
});

router.get('/2', async (req: Request, res: Response) => {
    try {
        const result = await getQuery2();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error executing query 2" });
    }
});

router.get('/3', async (req: Request, res: Response) => {
    try {
        const result = await getQuery3();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error executing query 3" });
    }
});

router.get('/4', async (req: Request, res: Response) => {
    try {
        const result = await getQuery4();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error executing query 4" });
    }
});

export default router; 