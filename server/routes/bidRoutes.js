// [TV3] Định tuyến POST /api/bids (gửi lượt đấu giá mới)
const express = require('express');
const router = express.Router();
const { placeBid, getBidsByProduct } = require('../controllers/bidController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Gửi lượt đấu giá mới (yêu cầu đăng nhập)
router.post('/', verifyToken, placeBid);

// Lấy lịch sử đặt giá của 1 sản phẩm
router.get('/product/:productId', getBidsByProduct);

module.exports = router;
