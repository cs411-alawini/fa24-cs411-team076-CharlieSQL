import express, { Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes';
import bioRoutes from './src/routes/bioRoutes';
import dailyRoutes from './src/routes/dailyRoutes';
import queryRoutes from './src/routes/queryRoutes';
import doctorRoutes from './src/routes/doctorRoutes';

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
app.use('/api/biometrics', bioRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/doctor-view', doctorRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});