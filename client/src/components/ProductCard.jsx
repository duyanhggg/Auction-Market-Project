// [TV4] Thẻ hiển thị nhanh sản phẩm ngoài trang chủ (Ảnh, giá hiện tại, nút xem)
import React from 'react';
import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';

export default function ProductCard({ product }) {
  const {
    _id,
    name,
    description,
    imageUrl,
    currentPrice,
    endTime,
    status,
  } = product;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-sm italic">Không có hình ảnh</div>
        )}
        <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-xs px-2 py-1 rounded">
          {status === 'active' ? 'Đang đấu giá' : 'Đã kết thúc'}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg text-slate-800 line-clamp-1 hover:text-amber-600 transition-colors">
            <Link to={`/product/${_id}`}>{name}</Link>
          </h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs text-gray-500">Giá hiện tại:</span>
            <span className="text-lg font-bold text-red-600">
              {Number(currentPrice || 0).toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="mb-3 text-xs text-gray-500">
            <CountdownTimer endTime={endTime} />
          </div>

          <Link
            to={`/product/${_id}`}
            className="w-full block text-center bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-md font-medium text-sm transition-colors"
          >
            Xem chi tiết & Đặt giá
          </Link>
        </div>
      </div>
    </div>
  );
}
