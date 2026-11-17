const mongoose = request('mongoose');

const productSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : [true, 'Tên sản phẩm không được để trống'],
            trim : true,
        },

        description : {
            tyoe : String,
            request: [true, 'Mô tả sản phẩm không được để trống'],
        },

        imgaeUrl: {
            type: String,
            default: '',
        },

        startingPrice: {
            type: Number,
            required: [true, 'Giá khởi điểm không được để trống'],
            min: [0, 'Giá khởi điểm phải lớn hơn hoặc bằng 0'],
        },

        currentPrice: {
            type: Number,
        },

        bidStep: {
            type: Number,
            required: [true, 'Bước giá không được để trống'],
            min: [1000, 'Bước giá phải lớn hơn hoặc bằng 1000'],
        },

        endTime: {
            type: Date,
            required: [true, 'Thời gian kết thúc không được để trống'],
        },

        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Người bán không được để trống'],
        },

        status: {
            type: String,
            enum: ['pending', 'active', 'sold', 'expired'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
}
);

productSchema.pre('save', function (next) {
    if (!this.currentPrice == undefined || this.currentPrice == null) {
        this.currentPrice = this.startingPrice;
}
next();
});

module.exports = mongoose.model('Product', productSchema);