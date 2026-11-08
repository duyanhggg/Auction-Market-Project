// [TV2 & TV4] API Đăng/Sửa/Xóa đồ cũ; API Tìm kiếm, Lọc khoảng giá, Phân trang
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Công khai: Xem danh sách (tìm kiếm, lọc, phân trang) & chi tiết sản phẩm
router.get('/', getProducts);
router.get('/:id', getProductById);

// Cần xác thực: Đăng bán, sửa, xóa
router.post('/', verifyToken, createProduct);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;
