// [TV3] Schema lượt ra giá (productId, bidderId, bidAmount, thời gian đặt)
const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    bidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bidAmount: {
      type: Number,
      required: [true, 'Vui lòng nhập số tiền đấu giá'],
      min: [0, 'Giá đặt không được âm'],
    },
    bidTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Bid', bidSchema);
