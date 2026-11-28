const express = require('express');
const router = express.Router();
const {
  placeBid,
  getBidsByProduct,
  updateBidNote,
  cancelBid,
} = require('../controllers/bidController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Xem danh sách lịch sử trả giá của một sản phẩm (Công khai)
router.get('/product/:productId', getBidsByProduct);

// Đặt giá mới cho sản phẩm (Yêu cầu đăng nhập)
router.post('/', verifyToken, placeBid);

// Cập nhật ghi chú lượt đặt giá (Yêu cầu đăng nhập)
router.put('/:id', verifyToken, updateBidNote);

// Rút lại lượt đặt giá trong 2 phút đầu (Yêu cầu đăng nhập)
router.delete('/:id', verifyToken, cancelBid);

module.exports = router;