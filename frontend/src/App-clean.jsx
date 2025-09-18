import { useEffect, useState } from 'react';

function Cart({ cart, onRemove, onCheckout, loading }) {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Cart</span>
        <button className="btn btn-sm btn-outline-danger" onClick={onCheckout} disabled={loading || cart.length === 0}>
          {loading ? 'Processing...' : 'Checkout'}
        </button>
      </div>
      <ul className="list-group list-group-flush">
        {cart.length === 0 && <li className="list-group-item">Cart is empty</li>}
        {cart.map(item => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={item.product._id}>
            <span>{item.product.name} <span className="badge bg-secondary ms-2">x{item.quantity}</span></span>
            <span>
              ${(item.product.price * item.quantity).toFixed(2)}
              <button className="btn btn-sm btn-link text-danger ms-2" onClick={() => onRemove(item.product._id)} title="Remove">&times;</button>
            </span>
          </li>
        ))}
      </ul>
      <div className="card-footer text-end">
        <strong>Total: ${total.toFixed(2)}</strong>
      </div>
    </div>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState('');
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch cart on mount
  useEffect(() => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(setCart);
  }, []);

  const addToCart = (product) => {
    setCartLoading(true);
    fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, quantity: 1 })
    })
      .then(res => res.json())
      .then(setCart)
      .finally(() => setCartLoading(false));
  };

  const removeFromCart = (productId) => {
    setCartLoading(true);
    fetch('/api/cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    })
      .then(res => res.json())
      .then(setCart)
      .finally(() => setCartLoading(false));
  };

  const checkout = () => {
    setCartLoading(true);
    setCheckoutMsg('');
    fetch('/api/cart/checkout', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setCart([]);
        setCheckoutMsg(data.message || 'Checkout complete!');
      })
      .finally(() => setCartLoading(false));
  };

  useEffect(() => {
    let url = '/api/products';
    const params = [];
    if (sort) params.push(`sort=${sort}`);
    if (category) params.push(`category=${category}`);
    if (params.length) url += '?' + params.join('&');
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setCategories([...new Set(data.map(p => p.category))]);
      });
  }, [sort, category]);

  const featured = products.find(p => p.discount > 0);
  const otherProducts = products.filter(p => !featured || p._id !== featured._id);

  return (
    <div className="container py-4">
      <h1 className="mb-4">Grocery Store</h1>

      <div className="row">
        <div className="col-md-8">
          {featured && (
            <div className="card mb-4 border-primary">
              <div className="row g-0 align-items-center">
                <div className="col-md-2">
                  <img src={featured.image} className="img-fluid rounded-start" alt={featured.name} />
                </div>
                <div className="col-md-10">
                  <div className="card-body">
                    <h5 className="card-title">Featured: {featured.name} <span className="badge bg-success ms-2">{featured.discount}% OFF</span></h5>
                    <p className="card-text">{featured.description}</p>
                    <p className="card-text">
                      <span className="text-decoration-line-through text-muted me-2">${featured.price.toFixed(2)}</span>
                      <span className="fw-bold">${(featured.price * (1 - featured.discount / 100)).toFixed(2)}</span>
                    </p>
                    <button className="btn btn-primary" onClick={() => addToCart(featured)} disabled={cartLoading}>Add to Cart</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="d-flex mb-3 gap-2">
            <select className="form-select w-auto" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="">Sort by...</option>
              <option value="name">Alphabetical</option>
              <option value="price">Price</option>
            </select>
            <select className="form-select w-auto" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="row row-cols-1 row-cols-md-2 g-4">
            {otherProducts.map(product => (
              <div className="col" key={product._id}>
                <div className="card h-100">
                  <img src={product.image} className="card-img-top" alt={product.name} />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text">
                      <span className="fw-bold">${product.price.toFixed(2)}</span>
                    </p>
                    <span className="badge bg-secondary">{product.category}</span>
                  </div>
                  <div className="card-footer bg-white border-0">
                    <button className="btn btn-outline-primary w-100" onClick={() => addToCart(product)} disabled={cartLoading}>Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-4">
          <Cart cart={cart} onRemove={removeFromCart} onCheckout={checkout} loading={cartLoading} />
          {checkoutMsg && <div className="alert alert-success mt-2">{checkoutMsg}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
