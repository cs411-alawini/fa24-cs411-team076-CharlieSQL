import express, { Request, Response } from 'express';
import userRoutes from './src/routes/userRoutes';
import bioRoutes from './src/routes/bioRoutes';

const app = express();
// our SQL server is running on port 3306, so maybe make sure this app also runs on 3306
const PORT = 3306;

app.use(express.json());
app.get('/api/', (req: Request, res: Response) => {
    res.send('API of project');
});

app.use('/users', userRoutes);  
app.use('/biometrics', bioRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});