import express from 'express';

const router = express.Router();

// In-memory cart for demo (not persistent)
let cart = [];

router.get('/', (req, res) => {
  res.json(cart);
});

router.post('/add', (req, res) => {
  const { product, quantity } = req.body;
  const existing = cart.find(item => item.product._id === product._id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  res.json(cart);
});

router.post('/remove', (req, res) => {
  const { productId } = req.body;
  cart = cart.filter(item => item.product._id !== productId);
  res.json(cart);
});

router.post('/checkout', (req, res) => {
  cart = [];
  res.json({ success: true, message: 'Checkout complete (fake)' });
});

export default router;
