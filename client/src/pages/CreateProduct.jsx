// [TV2] Trang Đăng bán (Form nhập thông tin đồ cũ, chọn ngày giờ đóng phiên)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CreateProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    startingPrice: '',
    bidStep: '10000',
    endTime: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra thời gian kết thúc
    const chosenTime = new Date(formData.endTime);
    if (chosenTime <= new Date()) {
      return setError('Thời gian kết thúc phải lớn hơn thời gian hiện tại!');
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi khi đăng sản phẩm');
      }

      navigate(`/product/${data.product._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          Đăng Bán Đồ Cũ Lên Sàn Đấu Giá
        </h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-6 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm đồ cũ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Laptop ThinkPad X1 Carbon Gen 6 cũ 95%"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả chi tiết & Tình trạng sử dụng <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả các vết trầy xước, phụ kiện đi kèm, lịch sử sử dụng..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đường dẫn hình ảnh (URL)
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá sàn khởi điểm (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="startingPrice"
                required
                min={0}
                value={formData.startingPrice}
                onChange={handleChange}
                placeholder="500000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bước giá tối thiểu (VND)
              </label>
              <input
                type="number"
                name="bidStep"
                min={1000}
                value={formData.bidStep}
                onChange={handleChange}
                placeholder="10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian đóng phiên đấu giá <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="endTime"
              required
              value={formData.endTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-3 rounded-md text-sm transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Đang tạo phiên đấu giá...' : 'Đăng Bán Ngay'}
          </button>
        </form>
      </div>
    </div>
  );
}
