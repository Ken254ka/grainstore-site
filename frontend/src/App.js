import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Customers from './pages/Customers';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-gray-900 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">🌾 Grain Store</h1>
              <ul className="flex gap-6">
                <li>
                  <Link to="/" className="hover:text-blue-400 transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-blue-400 transition-colors">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="hover:text-blue-400 transition-colors">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link to="/customers" className="hover:text-blue-400 transition-colors">
                    Customers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
          </Routes>
        </main>

        <footer className="bg-gray-900 text-white text-center py-4 mt-12">
          <p className="text-sm text-gray-400">&copy; 2024 Grain Store. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;