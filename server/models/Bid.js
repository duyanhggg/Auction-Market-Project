const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Thiếu thông tin sản phẩm đấu giá'],
      index: true,
    },
    bidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Thiếu thông tin người đặt giá'],
    },
    bidAmount: {
      type: Number,
      required: [true, 'Vui lòng nhập số tiền đặt giá'],
      min: [1000, 'Số tiền đặt giá tối thiểu là 1.000đ'],
    },
    note: {
      type: String,
      trim: true,
      maxlength: [200, 'Ghi chú tối đa 200 ký tự'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Bid', bidSchema);