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
  // clone and add _id for in-memory
  const cloned = docs.map(d => ({ ...d, _id: Math.random().toString(36).substr(2, 9) }));
  inMemory.push(...cloned);
  return cloned;
}

export async function find(filter = {}, sort = null) {
  if (useMongo) {
    let q = Product.find(filter).lean();
    if (sort) {
      const [field, direction] = sort.split('_');
      const sortOrder = direction === 'desc' ? -1 : 1;
      if (field === 'price') {
        q = q.sort({ price: sortOrder });
      } else if (field === 'name') {
        q = q.sort({ name: sortOrder });
      }
    }
    return q.exec();
  }
  // in-memory filter & sort
  let results = inMemory.filter(p => {
    for (const k of Object.keys(filter)) {
      if (p[k] !== filter[k]) return false;
    }
    return true;
  });
  if (sort) {
    const [field, direction] = sort.split('_');
    if (field === 'price') {
      results = results.sort((a, b) => direction === 'desc' ? b.price - a.price : a.price - b.price);
    } else if (field === 'name') {
      results = results.sort((a, b) => direction === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
    }
  }
  return results;
}

export function clearInMemory() {
  inMemory = [];
}
