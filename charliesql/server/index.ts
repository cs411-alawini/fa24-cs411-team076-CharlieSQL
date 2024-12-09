import express, { Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes';
import dailyRoutes from './src/routes/dailyRoutes';
import doctorRoutes from './src/routes/doctorRoutes';
import viewUserRoutes from './src/routes/viewUserRoutes';

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());

// Base route
app.get('/api/', (req: Request, res: Response) => {
    res.send('Diabetes Management System API');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/api/doctor-view', doctorRoutes);
app.use('/api/view-user', viewUserRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});