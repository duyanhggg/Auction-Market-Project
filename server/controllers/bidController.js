const Bid = require('../models/Bid');
const Product = require('../models/Product');
const { AppError } = require('../middlewares/errorMiddleware');

// [POST] /api/bids - Đặt giá mới cho món đồ cũ (Create)
const placeBid = async (req, res, next) => {
  try {
    const { productId, bidAmount, note } = req.body;
    const bidderId = req.user.id || req.user._id || req.user.userId;

    if (!productId || bidAmount === undefined || bidAmount === null) {
      return next(new AppError('Vui lòng cung cấp sản phẩm và số tiền đặt giá', 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Không tìm thấy sản phẩm đấu giá', 404));
    }

    // 1. Chặn chủ món đồ tự nâng giá sản phẩm của chính mình
    if (product.sellerId.toString() === bidderId.toString()) {
      return next(new AppError('Bạn không thể tự đặt giá cho sản phẩm của chính mình', 403));
    }

    // 2. Kiểm tra trạng thái & thời gian kết thúc phiên đấu giá
    if (product.status === 'pending') {
      return next(new AppError('Sản phẩm đang chờ duyệt, chưa mở phiên đấu giá', 400));
    }

    const now = new Date();
    if (
      product.status === 'sold' ||
      product.status === 'expired' ||
      now >= new Date(product.endTime)
    ) {
      // Tự động cập nhật trạng thái nếu đã quá giờ nhưng status vẫn đang là 'active'
      if (product.status === 'active') {
        const hasBids = await Bid.exists({ productId });
        product.status = hasBids ? 'sold' : 'expired';
        await product.save();
      }
      return next(new AppError('Phiên đấu giá cho món đồ này đã kết thúc', 400));
    }

    // 3. Kiểm tra mức giá hợp lệ dựa trên currentPrice và bidStep của sản phẩm
    const currentPrice = product.currentPrice ?? product.startingPrice;
    const step = product.bidStep || 1000;
    const minValidBid = currentPrice + step;
    const numericBid = Number(bidAmount);

    if (Number.isNaN(numericBid) || numericBid < minValidBid) {
      return next(
        new AppError(
          `Giá đặt phải cao hơn giá hiện tại ít nhất ${step.toLocaleString('vi-VN')}đ (tối thiểu ${minValidBid.toLocaleString('vi-VN')}đ)`,
          400
        )
      );
    }

    // 4. Tạo bản ghi trong collection Bids và cập nhật currentPrice ở collection Products
    const newBid = await Bid.create({
      productId,
      bidderId,
      bidAmount: numericBid,
      note: note || '',
    });

    product.currentPrice = numericBid;
    await product.save();

    const populatedBid = await newBid.populate('bidderId', 'fullName email phone');

    res.status(201).json({
      success: true,
      message: 'Đặt giá thành công!',
      data: {
        bid: populatedBid,
        currentPrice: product.currentPrice,
      },
    });
  } catch (error) {
    next(error);
  }
};

// [GET] /api/bids/product/:productId - Lấy lịch sử các lượt đặt giá của sản phẩm (Read)
const getBidsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const bids = await Bid.find({ productId })
      .populate('bidderId', 'fullName email')
      .sort({ bidAmount: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids,
    });
  } catch (error) {
    next(error);
  }
};

// [PUT] /api/bids/:id - Cập nhật ghi chú thương lượng của lượt đặt giá (Update)
const updateBidNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const userId = req.user.id || req.user._id || req.user.userId;

    const bid = await Bid.findById(id).populate('productId');
    if (!bid) {
      return next(new AppError('Không tìm thấy lượt đặt giá', 404));
    }

    if (bid.bidderId.toString() !== userId.toString()) {
      return next(new AppError('Bạn chỉ có thể sửa ghi chú lượt đặt giá của chính mình', 403));
    }

    if (
      !bid.productId ||
      bid.productId.status !== 'active' ||
      new Date() >= new Date(bid.productId.endTime)
    ) {
      return next(new AppError('Phiên đấu giá đã kết thúc, không thể chỉnh sửa ghi chú', 400));
    }

    bid.note = note ?? '';
    await bid.save();

    const updatedBid = await bid.populate('bidderId', 'fullName email');

    res.status(200).json({
      success: true,
      message: 'Đã cập nhật ghi chú đặt giá',
      data: updatedBid,
    });
  } catch (error) {
    next(error);
  }
};

// [DELETE] /api/bids/:id - Rút lượt đặt giá trong vòng 2 phút đầu (Delete)
const cancelBid = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id || req.user.userId;

    const bid = await Bid.findById(id);
    if (!bid) {
      return next(new AppError('Không tìm thấy lượt đặt giá', 404));
    }

    if (bid.bidderId.toString() !== userId.toString()) {
      return next(new AppError('Bạn không có quyền rút lượt đặt giá này', 403));
    }

    const product = await Product.findById(bid.productId);
    if (!product || product.status !== 'active' || new Date() >= new Date(product.endTime)) {
      return next(new AppError('Phiên đấu giá không còn hoạt động, không thể rút giá', 400));
    }

    // Giới hạn chỉ cho phép rút giá trong 2 phút đầu để tránh phá rối phiên đấu giá
    const elapsedMs = Date.now() - new Date(bid.createdAt).getTime();
    if (elapsedMs > 2 * 60 * 1000) {
      return next(new AppError('Đã quá thời hạn 2 phút để rút lại lượt đặt giá', 400));
    }

    await Bid.findByIdAndDelete(id);

    // Đồng bộ lại currentPrice của sản phẩm về mức giá cao thứ nhì (hoặc giá khởi điểm)
    const highestRemainingBid = await Bid.findOne({ productId: product._id }).sort({
      bidAmount: -1,
    });
    product.currentPrice = highestRemainingBid
      ? highestRemainingBid.bidAmount
      : product.startingPrice;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Đã rút lượt đặt giá và cập nhật lại giá hiện tại',
      data: {
        deletedBidId: id,
        currentPrice: product.currentPrice,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeBid,
  getBidsByProduct,
  updateBidNote,
  cancelBid,
};