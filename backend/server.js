const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static('public'));

// Initialize database
db.initializeDb();

// Routes
// ===== PRODUCTS =====
app.get('/api/products', (req, res) => {
  try {
    const products = db.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;
    
    // Validation
    if (!name || price === undefined || quantity === undefined || !category) {
      return res.status(400).json({ message: 'Missing required fields: name, price, quantity, category' });
    }
    
    const product = db.createProduct(name, price, quantity, category);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, category } = req.body;
    
    const product = db.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const updated = db.updateProduct(
      id,
      name !== undefined ? name : product.name,
      price !== undefined ? price : product.price,
      quantity !== undefined ? quantity : product.quantity,
      category !== undefined ? category : product.category
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = db.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    db.deleteProduct(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// ===== CUSTOMERS =====
app.get('/api/customers', (req, res) => {
  try {
    const customers = db.getAllCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
});

app.post('/api/customers', (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    const customer = db.createCustomer(name, email || null, phone || null);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error: error.message });
  }
});

app.put('/api/customers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    
    const customer = db.getCustomerById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    const updated = db.updateCustomer(
      id,
      name !== undefined ? name : customer.name,
      email !== undefined ? email : customer.email,
      phone !== undefined ? phone : customer.phone
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error: error.message });
  }
});

app.delete('/api/customers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const customer = db.getCustomerById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    db.deleteCustomer(id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error: error.message });
  }
});

// ===== ORDERS =====
app.get('/api/orders', (req, res) => {
  try {
    const orders = db.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const { customerId, productId, quantity } = req.body;
    
    // Validation
    if (!customerId || !productId || !quantity) {
      return res.status(400).json({ message: 'Missing required fields: customerId, productId, quantity' });
    }
    
    // Validate customer exists
    const customer = db.getCustomerById(customerId);
    if (!customer) {
      return res.status(400).json({ message: 'Customer not found' });
    }
    
    // Validate product exists and has enough stock
    const product = db.getProductById(productId);
    if (!product) {
      return res.status(400).json({ message: 'Product not found' });
    }
    
    const orderQty = parseInt(quantity);
    if (orderQty <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }
    
    if (orderQty > product.quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${product.quantity}`,
        available: product.quantity 
      });
    }
    
    // Decrease product quantity
    db.decreaseProductQuantity(productId, orderQty);
    
    // Create order
    const order = db.createOrder(customerId, productId, orderQty);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

app.put('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const order = db.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const updated = db.updateOrderStatus(id, status);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
});

app.delete('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const order = db.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Note: In a real app, you might want to restore the product quantity here
    db.deleteOrder(id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));