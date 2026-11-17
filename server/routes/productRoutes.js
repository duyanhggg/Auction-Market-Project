const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { verifyToken } = require('../middlewares/authMiddleware');

// GET /api/products/:id  — Công khai (ai cũng xem được)
router.get('/:id', getProductById);

// POST /api/products  — Chỉ người bán (seller) mới được đăng sản phẩm
router.post('/', verifyToken, createProduct);

// PUT /api/products/:id  — Chỉ người bán (seller) hoặc admin mới được sửa sản phẩm
router.put('/:id', verifyToken, updateProduct);

// DELETE /api/products/:id  — Chỉ người bán (seller) hoặc admin mới được xóa sản phẩm
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;