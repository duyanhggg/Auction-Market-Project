const { AppError } = require("../middlewares/errorMiddleware");
const Product = require("../models/Product");


// [POST] /api/products — Đăng bán sản phẩm mới


const createProduct = async(req, res, next) => {
    try {
        const {name, description, imageUrl, startingPrice, bidStep, endTime} = req.body;

        if (new Date(endTime) <= new Date()) {
            return next(new AppError('Thời gian kết thúc phải lớn hơn thời gian hiện tại', 400));
        }

        const product = await Product.create({
            name,
            description,
            imageUrl,
            startingPrice,
            bidStep,
            endTime,
            sellerId: req.user._id,
        });
    } catch (error) {
        next(error);
    }
};

// [GET] /api/products/:id — Lấy chi tiết 1 sản phẩm

const getProductById = async (req, res, next) => {
  try {
    // populate('sellerId', 'fullName email') → lấy thêm tên, email người bán
    const product = await Product.findById(req.params.id).populate(
      'sellerId',
      'fullName email'
    );
    if (!product) {
      return next(new AppError('Không tìm thấy sản phẩm', 404));
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// [PUT] /api/products/:id — Sửa sản phẩm (chỉ người bán hoặc admin)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError('Không tìm thấy sản phẩm', 404));
    }
    // Kiểm tra quyền: chỉ người bán hoặc admin mới được sửa
    const isOwner = product.sellerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return next(new AppError('Bạn không có quyền chỉnh sửa sản phẩm này', 403));
    }
    // Nếu cập nhật endTime thì validate lại
    if (req.body.endTime && new Date(req.body.endTime) <= new Date()) {
      return next(new AppError('Thời gian kết thúc phải lớn hơn thời điểm hiện tại', 400));
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: true → trả về doc sau khi update
    );
    res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công!',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// [DELETE] /api/products/:id — Xóa sản phẩm (chỉ người bán hoặc admin)
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new AppError('Không tìm thấy sản phẩm', 404));
        }
        // Kiểm tra quyền: chỉ người bán hoặc admin mới được xóa
        const isOwner = product.sellerId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return next(new AppError('Bạn không có quyền xóa sản phẩm này', 403));
        }
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Xóa sản phẩm thành công!',
        });
    } catch (error) {
        next(error);
    }
};

// Export — TV4 sẽ thêm getProducts vào file này sau
module.exports = { createProduct, getProductById, updateProduct, deleteProduct };