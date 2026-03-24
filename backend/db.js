const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Initialize database
const db = new Database(path.join(__dirname, 'grainstore.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initializeDb() {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      category TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customerId TEXT NOT NULL,
      productId TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customerId) REFERENCES customers(id),
      FOREIGN KEY (productId) REFERENCES products(id)
    );
  `);

  // Check if we need to seed initial data
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  if (productCount === 0) {
    const defaultProducts = [
      { id: uuidv4(), name: 'Wheat', price: 50, quantity: 100, category: 'Grain' },
      { id: uuidv4(), name: 'Rice', price: 60, quantity: 80, category: 'Grain' },
      { id: uuidv4(), name: 'Corn', price: 40, quantity: 120, category: 'Grain' }
    ];

    const insertProduct = db.prepare(
      'INSERT INTO products (id, name, price, quantity, category) VALUES (?, ?, ?, ?, ?)'
    );

    for (const product of defaultProducts) {
      insertProduct.run(product.id, product.name, product.price, product.quantity, product.category);
    }
  }
}

// Product functions
function getAllProducts() {
  return db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
}

function getProductById(id) {
  return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
}

function createProduct(name, price, quantity, category) {
  const id = uuidv4();
  const stmt = db.prepare(
    'INSERT INTO products (id, name, price, quantity, category) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run(id, name, price, quantity, category);
  return getProductById(id);
}

function updateProduct(id, name, price, quantity, category) {
  const stmt = db.prepare(
    'UPDATE products SET name = ?, price = ?, quantity = ?, category = ? WHERE id = ?'
  );
  stmt.run(name, price, quantity, category, id);
  return getProductById(id);
}

function deleteProduct(id) {
  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  return stmt.run(id);
}

function decreaseProductQuantity(productId, quantity) {
  const stmt = db.prepare(
    'UPDATE products SET quantity = quantity - ? WHERE id = ?'
  );
  return stmt.run(quantity, productId);
}

// Customer functions
function getAllCustomers() {
  return db.prepare('SELECT * FROM customers ORDER BY created_at DESC').all();
}

function getCustomerById(id) {
  return db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
}

function createCustomer(name, email, phone) {
  const id = uuidv4();
  const stmt = db.prepare(
    'INSERT INTO customers (id, name, email, phone) VALUES (?, ?, ?, ?)'
  );
  stmt.run(id, name, email, phone);
  return getCustomerById(id);
}

function updateCustomer(id, name, email, phone) {
  const stmt = db.prepare(
    'UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?'
  );
  stmt.run(name, email, phone, id);
  return getCustomerById(id);
}

function deleteCustomer(id) {
  const stmt = db.prepare('DELETE FROM customers WHERE id = ?');
  return stmt.run(id);
}

// Order functions
function getAllOrders() {
  return db.prepare(
    `SELECT o.*, c.name as customerName, p.name as productName 
     FROM orders o 
     LEFT JOIN customers c ON o.customerId = c.id 
     LEFT JOIN products p ON o.productId = p.id 
     ORDER BY o.created_at DESC`
  ).all();
}

function getOrderById(id) {
  return db.prepare(
    `SELECT o.*, c.name as customerName, p.name as productName 
     FROM orders o 
     LEFT JOIN customers c ON o.customerId = c.id 
     LEFT JOIN products p ON o.productId = p.id 
     WHERE o.id = ?`
  ).get(id);
}

function createOrder(customerId, productId, quantity) {
  const id = uuidv4();
  const stmt = db.prepare(
    'INSERT INTO orders (id, customerId, productId, quantity, status) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run(id, customerId, productId, quantity, 'pending');
  return getOrderById(id);
}

function updateOrderStatus(id, status) {
  const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
  stmt.run(status, id);
  return getOrderById(id);
}

function deleteOrder(id) {
  const stmt = db.prepare('DELETE FROM orders WHERE id = ?');
  return stmt.run(id);
}

module.exports = {
  db,
  initializeDb,
  // Products
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  decreaseProductQuantity,
  // Customers
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  // Orders
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder
};
