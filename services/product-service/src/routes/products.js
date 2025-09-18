import express from 'express';
import { find } from '../store.js';

const router = express.Router();

// Get all products with optional sorting and filtering
router.get('/', async (req, res) => {
  const { sort, category } = req.query;
  const filter = {};
  if (category) filter.category = category;
  const products = await find(filter, sort);
  res.json(products);
});

export default router;
