// [TV2] Xử lý CRUD sản phẩm đồ cũ & validate thời gian đăng bán
// [TV4] Hỗ trợ Tìm kiếm, Lọc khoảng giá, Phân trang
const Product = require('../models/Product');

// @desc    Lấy danh sách sản phẩm (có tìm kiếm, lọc giá, phân trang)
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { keyword, minPrice, maxPrice, page = 1, limit = 8 } = req.query;

    const query = { status: 'active' };

    // Tìm kiếm theo tên hoặc mô tả
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Lọc theo khoảng giá hiện tại
    if (minPrice || maxPrice) {
      query.currentPrice = {};
      if (minPrice) query.currentPrice.$gte = Number(minPrice);
      if (maxPrice) query.currentPrice.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('sellerId', 'fullName email')
      .populate('currentBidderId', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalProducts: total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy chi tiết 1 sản phẩm
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'fullName email')
      .populate('currentBidderId', 'fullName email');

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Đăng bán sản phẩm đồ cũ mới
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, description, imageUrl, startingPrice, endTime, bidStep } = req.body;

    // Validate thời gian kết thúc phải lớn hơn thời gian hiện tại
    const end = new Date(endTime);
    if (isNaN(end.getTime()) || end <= new Date()) {
      return res.status(400).json({ message: 'Thời gian đóng phiên phải sau thời điểm hiện tại' });
    }

    if (!name || !description || startingPrice === undefined) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ các thông tin bắt buộc' });
    }

    const product = await Product.create({
      name,
      description,
      imageUrl: imageUrl || '',
      startingPrice: Number(startingPrice),
      currentPrice: Number(startingPrice),
      bidStep: bidStep ? Number(bidStep) : 10000,
      endTime: end,
      sellerId: req.user.id,
    });

    res.status(201).json({
      message: 'Đăng sản phẩm thành công',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật thông tin sản phẩm (chỉ người bán được sửa)
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền sửa sản phẩm này' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Cập nhật sản phẩm thành công',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa sản phẩm này' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
