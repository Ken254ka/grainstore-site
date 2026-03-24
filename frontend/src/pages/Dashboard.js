import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0 });

  useEffect(() => {
    // Fetch stats
    Promise.all([
      fetch('/api/products').then(res => res.json()),
      fetch('/api/orders').then(res => res.json()),
      fetch('/api/customers').then(res => res.json())
    ]).then(([products, orders, customers]) => {
      setStats({
        products: products.length,
        orders: orders.length,
        customers: customers.length
      });
    });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Products</h2>
          <p>{stats.products}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Orders</h2>
          <p>{stats.orders}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Customers</h2>
          <p>{stats.customers}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;