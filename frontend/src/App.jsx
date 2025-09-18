
import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';

function CartPage({ cart, onRemove, onCheckout, loading }) {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  // Prevent accidental state changes if showFilters is false (homepage)
  // Only use sort/category/setSort/setCategory if showFilters is true
  // Otherwise, render only the product cards
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

function ProductsPage({ products, featured, otherProducts, categories, sort, setSort, category, setCategory, addToCart, cartLoading, showFilters = true, showFeatured = false }) {
  return (
    <div className="d-flex flex-column flex-lg-row gap-4">
      <div className="flex-grow-1">
        {featured && showFeatured && (
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

        {showFilters && (
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
        )}

        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3">
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
  const [searchParams] = useSearchParams();

  // Read URL parameters on mount and when URL changes
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSort = searchParams.get('sort');
    if (urlCategory) setCategory(urlCategory);
    if (urlSort) setSort(urlSort);
  }, [searchParams]);

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
    // Always fetch all products to get all categories
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setCategories([...new Set(data.map(p => p.category))]);
      });
  }, []);

  const featured = products.find(p => p.discount > 0);
  
  // Filter and sort products on the frontend
  let filteredProducts = products;
  if (category) {
    console.log('Filtering by category:', category);
    console.log('All products:', products.map(p => ({ name: p.name, category: p.category })));
    filteredProducts = filteredProducts.filter(p => p.category === category);
    console.log('Filtered products:', filteredProducts.map(p => ({ name: p.name, category: p.category })));
  }
  if (sort === 'name') {
    filteredProducts = filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'price') {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  }
  
  // For the products page, include all filtered products (including featured)
  // For the homepage, exclude featured from otherProducts since it's shown separately
  const otherProducts = filteredProducts;

  // Navbar with cart count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <>
      <div style={{ minHeight: '100vh', minWidth: '100vw', background: '#f5f6fa', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '5vh', paddingBottom: '5vh' }}>
        <div className="container d-flex flex-column align-items-center justify-content-flex-start" style={{ minHeight: '90vh', maxWidth: 900, padding: 0 }}>
          <div style={{ width: '100%', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 rounded-top" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div className="container-fluid">
                <Link className="navbar-brand" to="/">Simple Grocery Store</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                      <Link className="nav-link" to="/products">All Products</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link position-relative" to="/cart">
                        Cart
                        {cartCount > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
            <div style={{ padding: '2.5rem 2rem' }}>
              <Routes>
                <Route path="/" element={
                  <div className="d-flex flex-column align-items-center">
                    <h2 className="mb-4">Featured Product</h2>
                    {featured && (
                      <div className="mb-4" style={{ width: '100%', maxWidth: 400 }}>
                        <ProductsPage
                          products={[featured]}
                          featured={featured}
                          otherProducts={[]}
                          categories={[]}
                          sort={''}
                          setSort={() => {}}
                          category={''}
                          setCategory={() => {}}
                          addToCart={addToCart}
                          cartLoading={cartLoading}
                          showFilters={false}
                          showFeatured={true}
                        />
                      </div>
                    )}
                    <h4 className="mt-4 mb-3">Explore the whole range</h4>
                    <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                      {categories.map(cat => (
                        <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="btn btn-outline-secondary">
                          {cat}
                        </Link>
                      ))}
                    </div>
                    <Link to="/products" className="btn btn-primary">View All Products</Link>
                  </div>
                } />
                <Route path="/products" element={
                  <ProductsPage
                    products={filteredProducts}
                    featured={featured}
                    otherProducts={otherProducts}
                    categories={categories}
                    sort={sort}
                    setSort={setSort}
                    category={category}
                    setCategory={setCategory}
                    addToCart={addToCart}
                    cartLoading={cartLoading}
                    showFilters={true}
                    showFeatured={false}
                  />
                } />
                <Route path="/cart" element={
                  <div className="d-flex justify-content-center w-100">
                    <div className="col-12 col-md-8 col-lg-6">
                      <CartPage cart={cart} onRemove={removeFromCart} onCheckout={checkout} loading={cartLoading} />
                      {checkoutMsg && <div className="alert alert-success mt-2">{checkoutMsg}</div>}
                    </div>
                  </div>
                } />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
