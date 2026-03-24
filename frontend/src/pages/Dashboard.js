import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

function Dashboard() {
  const [stats, setStats] = useState({ 
    products: 0, 
    orders: 0, 
    customers: 0,
    totalValue: 0,
    lowStockItems: 0 
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch all data
    Promise.all([
      fetch(`${API_BASE_URL}/api/products`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/orders`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/customers`).then(res => res.json())
    ]).then(([products, orders, customers]) => {
      const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      const lowStockItems = products.filter(p => p.quantity < 20).length;
      
      setStats({
        products: products.length,
        orders: orders.length,
        customers: customers.length,
        totalValue: totalValue.toFixed(2),
        lowStockItems: lowStockItems
      });
      setProducts(products);
      setOrders(orders);
    });
  }, []);

  const StatCard = ({ icon, title, value, color, link }) => (
    <Link 
      to={link}
      className={`card hover:shadow-lg transition-shadow cursor-pointer border-t-4 ${
        color === 'blue' ? 'border-t-blue-500' :
        color === 'green' ? 'border-t-green-500' :
        color === 'purple' ? 'border-t-purple-500' :
        'border-t-yellow-500'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`text-4xl ${
          color === 'blue' ? 'text-blue-500' :
          color === 'green' ? 'text-green-500' :
          color === 'purple' ? 'text-purple-500' :
          'text-yellow-500'
        }`}>
          {icon}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your grain store management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon="📦" 
          title="Total Products" 
          value={stats.products}
          color="blue"
          link="/products"
        />
        <StatCard 
          icon="📋" 
          title="Total Orders" 
          value={stats.orders}
          color="green"
          link="/orders"
        />
        <StatCard 
          icon="👥" 
          title="Total Customers" 
          value={stats.customers}
          color="purple"
          link="/customers"
        />
        <StatCard 
          icon="💰" 
          title="Inventory Value" 
          value={`$${stats.totalValue}`}
          color="yellow"
          link="/products"
        />
      </div>

      {/* Alerts */}
      {stats.lowStockItems > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold">{stats.lowStockItems} Items Low on Stock</p>
            <p className="text-sm">Some products have quantity less than 20 units</p>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{order.customerName || 'Customer'}</p>
                    <p className="text-sm text-gray-600">{order.productName || 'Product'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">Qty: {order.quantity}</p>
                    <p className={`text-sm font-medium ${
                      order.status === 'pending' ? 'text-yellow-600' :
                      order.status === 'shipped' ? 'text-blue-600' :
                      'text-green-600'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/orders" className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all orders →
          </Link>
        </div>

        {/* Low Stock Items */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Low Stock Items</h2>
          {products.filter(p => p.quantity < 20).length === 0 ? (
            <p className="text-gray-500 text-center py-8">All items well stocked</p>
          ) : (
            <div className="space-y-3">
              {products.filter(p => p.quantity < 20).map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-200">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-yellow-600">{product.quantity} units</p>
                    <p className="text-sm text-gray-600">${product.price.toFixed(2)}/unit</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/products" className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
            Manage inventory →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;