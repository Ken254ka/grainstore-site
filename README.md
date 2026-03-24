# Grain Store Management Site

A full-stack web application for managing a grain store, built with Node.js (Express) backend and React frontend.

## Features

- **Dashboard**: Overview of products, orders, and customers
- **Products Management**: Add, view, and delete products
- **Orders Management**: Create and track orders
- **Customers Management**: Manage customer information

## Tech Stack

- **Backend**: Node.js, Express, CORS
- **Frontend**: React, React Router
- **Data**: In-memory storage (for demo purposes)

## Getting Started

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Start the development servers:
   ```bash
   npm run dev
   ```

   This will start both backend (port 5000) and frontend (port 3000).

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Add a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Add a new order
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Add a new customer

## Future Enhancements

- Add authentication
- Connect to a real database (PostgreSQL/MySQL)
- Add inventory tracking
- Implement order status updates
- Add reporting and analytics