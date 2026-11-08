// [TV2] Schema sản phẩm (Mô tả đồ cũ, Giá hiện tại, Giá sàn, EndTime)
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên sản phẩm đồ cũ'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả tình trạng đồ cũ'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    startingPrice: {
      type: Number,
      required: [true, 'Vui lòng nhập giá sàn khởi điểm'],
      min: [0, 'Giá sàn không được âm'],
    },
    currentPrice: {
      type: Number,
      required: true,
      min: [0, 'Giá hiện tại không được âm'],
    },
    bidStep: {
      type: Number,
      default: 10000, // Bước giá tối thiểu
    },
    endTime: {
      type: Date,
      required: [true, 'Vui lòng chọn thời gian kết thúc đấu giá'],
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    currentBidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'ended', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
