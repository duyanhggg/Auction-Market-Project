// [TV3] Trang Chi tiết: hiển thị thông số đồ cũ, countdown, ô nhập tiền đặt giá
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const fetchProductAndBids = async () => {
    try {
      const [prodRes, bidsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/products/${id}`),
        fetch(`http://localhost:5000/api/bids/product/${id}`),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProduct(prodData);
        if (new Date(prodData.endTime) <= new Date() || prodData.status === 'ended') {
          setIsExpired(true);
        }
      }
      if (bidsRes.ok) {
        const bidsData = await bidsRes.json();
        setBids(bidsData);
      }
    } catch (err) {
      console.error('Lỗi lấy thông tin sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndBids();
  }, [id]);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (!bidAmount) {
      return setError('Vui lòng nhập số tiền bạn muốn đấu giá');
    }

    setSubmitting(true);

    try {
      const res = await fetch('http://localhost:5000/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          bidAmount: Number(bidAmount),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi khi đặt giá');
      }

      setSuccess('Đặt giá thành công!');
      setBidAmount('');
      fetchProductAndBids();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
        Không tìm thấy sản phẩm yêu cầu.
      </div>
    );
  }

  const minBidSuggestion = product.currentPrice + (product.bidStep || 10000);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Hình ảnh */}
        <div className="bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center min-h-[350px]">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover max-h-[450px]"
            />
          ) : (
            <span className="text-gray-400">Không có hình ảnh</span>
          )}
        </div>

        {/* Thông tin đấu giá & Đặt giá */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <span className="inline-block px-2.5 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-800 mb-2">
              Tình trạng: Đồ cũ thanh lý
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 text-sm whitespace-pre-line mb-4">
              {product.description}
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Giá khởi điểm:</span>
                <span className="text-sm font-semibold text-gray-700">
                  {product.startingPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Giá hiện tại cao nhất:</span>
                <span className="text-2xl font-extrabold text-red-600">
                  {product.currentPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Người bán:</span>
                <span className="text-sm font-medium text-slate-800">
                  {product.sellerId?.fullName || 'Người dùng ẩn danh'}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <CountdownTimer
                  endTime={product.endTime}
                  onExpire={() => setIsExpired(true)}
                />
              </div>
            </div>
          </div>

          {/* Form Đặt Giá */}
          <div className="border-t border-gray-100 pt-4">
            {error && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-md mb-3 border-l-4 border-red-500">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-700 text-xs p-3 rounded-md mb-3 border-l-4 border-green-500">
                {success}
              </div>
            )}

            <form onSubmit={handlePlaceBid} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Nhập số tiền muốn đặt (Tối thiểu: {minBidSuggestion.toLocaleString('vi-VN')} đ)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    disabled={isExpired}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`VD: ${minBidSuggestion}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100"
                  />
                  <button
                    type="submit"
                    disabled={isExpired || submitting}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExpired ? 'Đã hết giờ' : submitting ? 'Đang gửi...' : 'Đặt Giá'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Lịch sử đặt giá */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Lịch sử đấu giá ({bids.length} lượt)
        </h2>
        {bids.length > 0 ? (
          <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
            {bids.map((b) => (
              <div key={b._id} className="py-2.5 flex justify-between items-center text-sm">
                <span className="font-medium text-slate-800">
                  {b.bidderId?.fullName || 'Người tham gia'}
                </span>
                <span className="text-red-600 font-bold">
                  {b.bidAmount.toLocaleString('vi-VN')} đ
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(b.createdAt || b.bidTime).toLocaleTimeString('vi-VN')} -{' '}
                  {new Date(b.createdAt || b.bidTime).toLocaleDateString('vi-VN')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Chưa có ai đặt giá cho sản phẩm này. Hãy là người đầu tiên!</p>
        )}
      </div>
    </div>
  );
}
