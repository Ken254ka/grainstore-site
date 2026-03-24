import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../config';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    fetch(`${API_BASE_URL}/api/customers`)
      .then(res => res.json())
      .then(setCustomers)
      .catch(err => setError('Failed to fetch customers'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name) {
      setError('Customer name is required');
      return;
    }

    fetch(`${API_BASE_URL}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setSuccess('Customer added successfully!');
          fetchCustomers();
          setForm({ name: '', email: '', phone: '' });
          setTimeout(() => setSuccess(''), 3000);
        }
      })
      .catch(err => setError('Failed to add customer'));
  };

  const deleteCustomer = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      fetch(`${API_BASE_URL}/api/customers/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
          setSuccess('Customer deleted successfully!');
          fetchCustomers();
          setTimeout(() => setSuccess(''), 3000);
        })
        .catch(err => setError('Failed to delete customer'));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Customers Management</h1>
        <p className="text-gray-600">Manage your customer database</p>
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="form-input"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="form-input"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="form-input"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full md:w-auto">
            + Add Customer
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          All Customers ({customers.length})
        </h2>
        {customers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No customers added yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.id}>
                    <td className="font-medium">{customer.name}</td>
                    <td>{customer.email ? customer.email : '-'}</td>
                    <td>{customer.phone ? customer.phone : '-'}</td>
                    <td>
                      <button
                        onClick={() => deleteCustomer(customer.id, customer.name)}
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

export default Customers;