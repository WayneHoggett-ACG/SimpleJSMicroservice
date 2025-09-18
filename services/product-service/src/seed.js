import { countDocuments, insertMany } from './store.js';

const sampleProducts = [
  { name: 'Bananas', description: 'Fresh bananas', price: 0.99, image: '/images/bananas.png', category: 'Fruit', discount: 10 },
  { name: 'Bread', description: 'Whole wheat bread', price: 2.49, image: '/images/bread.png', category: 'Bakery', discount: 0 },
  { name: 'Cereal', description: 'Breakfast cereal', price: 3.99, image: '/images/cereal.png', category: 'Breakfast', discount: 0 },
  { name: 'Cheese', description: 'Cheddar cheese', price: 4.49, image: '/images/cheese.png', category: 'Dairy', discount: 0 }
];

export async function seedProducts() {
  const count = await countDocuments();
  if (count === 0) {
    const productsWithImages = sampleProducts.filter(p => p.image && p.image.trim() !== '').map(p => ({ ...p, name: `${p.name} Example` }));
    await insertMany(productsWithImages);
    console.log('Product service: Sample products seeded (with images only, names appended with " Example")');
  }
}
