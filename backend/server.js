// backend/server.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on:`);
  console.log(`👉 Local: http://localhost:5000`);
  console.log(`👉 Mobile: http://192.168.0.102:5000`);
});