// [TV4] Logic lấy lịch sử đấu giá, danh sách đồ đã thắng của từng user
const Product = require('../models/Product');
const Bid = require('../models/Bid');

// @desc    Lấy dữ liệu dashboard cá nhân (sản phẩm đã đăng, lịch sử đặt giá, sản phẩm đã thắng)
// @route   GET /api/users/dashboard
const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // 1. Danh sách sản phẩm người dùng đã đăng bán
    const myListedProducts = await Product.find({ sellerId: userId })
      .sort({ createdAt: -1 });

    // 2. Lịch sử các lượt ra giá của người dùng
    const myBids = await Bid.find({ bidderId: userId })
      .populate('productId', 'name currentPrice endTime imageUrl status')
      .sort({ createdAt: -1 });

    // 3. Danh sách sản phẩm người dùng đã thắng
    // (Phiên đã kết thúc và currentBidderId chính là user)
    const wonProducts = await Product.find({
      currentBidderId: userId,
      $or: [
        { status: 'ended' },
        { endTime: { $lte: now } },
      ],
    }).populate('sellerId', 'fullName email');

    // 4. Danh sách các phiên đang tham gia và đang dẫn đầu
    const activeWinningProducts = await Product.find({
      currentBidderId: userId,
      status: 'active',
      endTime: { $gt: now },
    });

    res.status(200).json({
      myListedProducts,
      myBids,
      wonProducts,
      activeWinningProducts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserDashboard,
};
