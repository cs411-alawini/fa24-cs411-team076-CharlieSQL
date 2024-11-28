import { Router, Request, Response } from 'express';
import { getAllUsers, createUser, deleteUser } from '../services/database';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error getting users" });
    }
});

router.post('/', async (req: Request, res: Response) => {
    const { age, gender, country, diagnosis } = req.body;
    try {
        const newUser = await createUser(age, gender, country, diagnosis);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
});

router.delete('/:userId', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    try {
        await deleteUser(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
});

export default router;
