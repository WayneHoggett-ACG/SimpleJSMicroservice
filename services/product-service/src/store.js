import Product from './models/Product.js';

let useMongo = false;
let inMemory = [];

export function setUseMongo(flag) {
  useMongo = !!flag;
}

export async function countDocuments() {
  if (useMongo) {
    return Product.countDocuments();
  }
  return inMemory.length;
}

export async function insertMany(docs) {
  if (useMongo) {
    return Product.insertMany(docs);
  }
  // clone and push
  const cloned = docs.map(d => ({ ...d }));
  inMemory.push(...cloned);
  return cloned;
}

export async function find(filter = {}, sort = null) {
  if (useMongo) {
    let q = Product.find(filter).lean();
    if (sort === 'price') q = q.sort({ price: 1 });
    else if (sort === 'name') q = q.sort({ name: 1 });
    return q.exec();
  }
  // in-memory filter & sort
  let results = inMemory.filter(p => {
    for (const k of Object.keys(filter)) {
      if (p[k] !== filter[k]) return false;
    }
    return true;
  });
  if (sort === 'price') results = results.sort((a, b) => a.price - b.price);
  else if (sort === 'name') results = results.sort((a, b) => a.name.localeCompare(b.name));
  return results;
}

export function clearInMemory() {
  inMemory = [];
}
