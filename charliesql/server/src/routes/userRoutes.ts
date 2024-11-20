import { Router, Request, Response } from 'express';
import { getAllUsers } from '../services/database';
import { UserInfo } from '../models/dataTypes';

const router = Router();


router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error getting users"});
    }
});

export default router;
