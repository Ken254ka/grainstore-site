import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../config';

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', quantity: '', category: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(setProducts)
      .catch(err => setError('Failed to fetch products'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!form.name || !form.price || !form.quantity || !form.category) {
      setError('All fields are required');
      return;
    }

    fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setSuccess('Product added successfully!');
          fetchProducts();
          setForm({ name: '', price: '', quantity: '', category: '' });
          setTimeout(() => setSuccess(''), 3000);
        }
      })
      .catch(err => setError('Failed to add product'));
  };

  const deleteProduct = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      fetch(`${API_BASE_URL}/api/products/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
          setSuccess('Product deleted successfully!');
          fetchProducts();
          setTimeout(() => setSuccess(''), 3000);
        })
        .catch(err => setError('Failed to delete product'));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Products Management</h1>
        <p className="text-gray-600">Manage your grain products inventory</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="form-input"
              required
            />
            <input
              type="number"
              placeholder="Price per unit"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="form-input"
              step="0.01"
              required
            />
            <input
              type="number"
              placeholder="Quantity in stock"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="form-input"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full md:w-auto">
            + Add Product
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          All Products ({products.length})
        </h2>
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No products added yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="font-medium">{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <span className={product.quantity < 20 ? 'text-red-600 font-semibold' : ''}>
                        {product.quantity} units
                      </span>
                    </td>
                    <td>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {product.category}
                      </span>
                    </td>
                    <td>
                      {product.quantity < 20 ? (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                          Low Stock
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => deleteProduct(product.id, product.name)}
                        className="btn btn-danger text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;