// [TV4] Định tuyến GET /api/users/dashboard
const express = require('express');
const router = express.Router();
const { getUserDashboard } = require('../controllers/dashboardController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Lấy thông tin dashboard người dùng hiện tại (sản phẩm đã đăng, lịch sử đấu giá, đồ đã thắng)
router.get('/', verifyToken, getUserDashboard);

module.exports = router;
