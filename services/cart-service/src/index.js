import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cartRoutes from './routes/cart.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5002;

app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => res.send('Cart service is running'));

app.listen(PORT, () => console.log(`Cart service running on port ${PORT}`));
