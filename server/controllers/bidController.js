// [TV3] Thuật toán xử lý đặt giá: chặn giá thấp, chặn khi hết giờ phiên
const Bid = require('../models/Bid');
const Product = require('../models/Product');

// @desc    Đặt giá cho một sản phẩm đấu giá
// @route   POST /api/bids
const placeBid = async (req, res, next) => {
  try {
    const { productId, bidAmount } = req.body;
    const bidderId = req.user.id;

    if (!productId || !bidAmount) {
      return res.status(400).json({ message: 'Vui lòng cung cấp productId và số tiền đặt giá' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // Chặn người bán tự đấu giá sản phẩm của mình
    if (product.sellerId.toString() === bidderId) {
      return res.status(400).json({ message: 'Bạn không thể tự đấu giá sản phẩm của chính mình' });
    }

    // Chặn khi phiên đã kết thúc hoặc trạng thái không active
    const now = new Date();
    if (product.status !== 'active' || new Date(product.endTime) <= now) {
      product.status = 'ended';
      await product.save();
      return res.status(400).json({ message: 'Phiên đấu giá cho sản phẩm này đã kết thúc' });
    }

    // Chặn giá thấp hơn mức yêu cầu (currentPrice + bidStep)
    const minRequiredBid = product.currentPrice + (product.bidStep || 10000);
    if (Number(bidAmount) < minRequiredBid) {
      return res.status(400).json({
        message: `Giá đặt phải tối thiểu là ${minRequiredBid.toLocaleString('vi-VN')} VND (cao hơn giá hiện tại ít nhất ${product.bidStep?.toLocaleString('vi-VN') || '10,000'} VND)`,
      });
    }

    // Tạo lượt đấu giá mới
    const newBid = await Bid.create({
      productId,
      bidderId,
      bidAmount: Number(bidAmount),
    });

    // Cập nhật giá hiện tại và người dẫn đầu phiên
    product.currentPrice = Number(bidAmount);
    product.currentBidderId = bidderId;
    await product.save();

    res.status(201).json({
      message: 'Đặt giá thành công',
      bid: newBid,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy lịch sử các lượt ra giá của 1 sản phẩm
// @route   GET /api/bids/product/:productId
const getBidsByProduct = async (req, res, next) => {
  try {
    const bids = await Bid.find({ productId: req.params.productId })
      .populate('bidderId', 'fullName')
      .sort({ createdAt: -1 });

    res.status(200).json(bids);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeBid,
  getBidsByProduct,
};
