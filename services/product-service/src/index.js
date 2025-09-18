import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { seedProducts } from './seed.js';
import productRoutes from './routes/products.js';
import { setUseMongo } from './store.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || '';

async function start() {
  if (MONGO_URI && MONGO_URI.trim() !== '') {
    try {
      await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Product service: Connected to MongoDB');
      setUseMongo(true);
    } catch (err) {
      console.error('MongoDB connection error:', err);
      setUseMongo(false);
    }
  } else {
    console.log('Product service: No MONGO_URI provided, using in-memory store');
    setUseMongo(false);
  }

  await seedProducts();
  app.use('/api/products', productRoutes);
  app.get('/', (req, res) => res.send('Product service is running'));
  app.listen(PORT, () => console.log(`Product service running on port ${PORT}`));
}

start();
