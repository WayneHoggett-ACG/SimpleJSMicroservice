import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: { type: String, default: 'General' },
  discount: { type: Number, default: 0 }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
