// [DÙNG CHUNG] File khởi chạy server chính, cấu hình CORS, tích hợp các Routes
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get('/', (req, res) => {
  res.send('Server Sàn Đấu Giá Đồ Cũ is running...');
});

// Import & Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));
app.use('/api/users/dashboard', require('./routes/dashboardRoutes'));

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
