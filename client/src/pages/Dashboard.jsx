// [TV4] Trang Lịch sử cá nhân: Thống kê đồ mình đã đăng, các phiên mình đang thắng
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('listed'); // 'listed', 'winning', 'won', 'bids'
  const [data, setData] = useState({
    myListedProducts: [],
    myBids: [],
    wonProducts: [],
    activeWinningProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Trang Quản Lý Cá Nhân
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Xin chào, <span className="font-semibold text-slate-800">{user?.fullName}</span> ({user?.email})
        </p>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-center">
            <span className="text-2xl font-bold text-amber-700">
              {data.myListedProducts.length}
            </span>
            <p className="text-xs text-amber-800 mt-1">Đồ đã đăng bán</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
            <span className="text-2xl font-bold text-blue-700">
              {data.activeWinningProducts.length}
            </span>
            <p className="text-xs text-blue-800 mt-1">Đang dẫn đầu</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
            <span className="text-2xl font-bold text-green-700">
              {data.wonProducts.length}
            </span>
            <p className="text-xs text-green-800 mt-1">Sản phẩm đã thắng</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-center">
            <span className="text-2xl font-bold text-purple-700">
              {data.myBids.length}
            </span>
            <p className="text-xs text-purple-800 mt-1">Lượt tham gia ra giá</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 space-x-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('listed')}
          className={`pb-3 ${
            activeTab === 'listed'
              ? 'border-b-2 border-amber-500 text-amber-600 font-bold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Đồ đã đăng ({data.myListedProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('winning')}
          className={`pb-3 ${
            activeTab === 'winning'
              ? 'border-b-2 border-amber-500 text-amber-600 font-bold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Đang dẫn đầu ({data.activeWinningProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('won')}
          className={`pb-3 ${
            activeTab === 'won'
              ? 'border-b-2 border-amber-500 text-amber-600 font-bold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Đã thắng cuộc ({data.wonProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('bids')}
          className={`pb-3 ${
            activeTab === 'bids'
              ? 'border-b-2 border-amber-500 text-amber-600 font-bold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Lịch sử đặt giá ({data.myBids.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {activeTab === 'listed' && (
          <div>
            {data.myListedProducts.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {data.myListedProducts.map((p) => (
                  <div key={p._id} className="py-4 flex justify-between items-center">
                    <div>
                      <Link to={`/product/${p._id}`} className="font-semibold text-slate-800 hover:text-amber-600">
                        {p.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-1">
                        Hết hạn: {new Date(p.endTime).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">
                        {p.currentPrice.toLocaleString('vi-VN')} đ
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Bạn chưa đăng sản phẩm nào.</p>
            )}
          </div>
        )}

        {activeTab === 'winning' && (
          <div>
            {data.activeWinningProducts.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {data.activeWinningProducts.map((p) => (
                  <div key={p._id} className="py-4 flex justify-between items-center">
                    <div>
                      <Link to={`/product/${p._id}`} className="font-semibold text-slate-800 hover:text-amber-600">
                        {p.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-1">
                        Hết hạn: {new Date(p.endTime).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {p.currentPrice.toLocaleString('vi-VN')} đ (Đang giữ giá)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Hiện bạn không dẫn đầu phiên nào.</p>
            )}
          </div>
        )}

        {activeTab === 'won' && (
          <div>
            {data.wonProducts.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {data.wonProducts.map((p) => (
                  <div key={p._id} className="py-4 flex justify-between items-center">
                    <div>
                      <Link to={`/product/${p._id}`} className="font-semibold text-green-700 hover:underline">
                        🎉 {p.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-1">
                        Người bán: {p.sellerId?.fullName} ({p.sellerId?.email})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">
                        {p.currentPrice.toLocaleString('vi-VN')} đ
                      </p>
                      <span className="text-xs font-semibold text-green-600">Thắng phiên</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Bạn chưa thắng sản phẩm nào.</p>
            )}
          </div>
        )}

        {activeTab === 'bids' && (
          <div>
            {data.myBids.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {data.myBids.map((b) => (
                  <div key={b._id} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      {b.productId ? (
                        <Link to={`/product/${b.productId._id}`} className="font-medium text-slate-800 hover:text-amber-600">
                          {b.productId.name}
                        </Link>
                      ) : (
                        <span className="text-gray-400">Sản phẩm đã gỡ</span>
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(b.createdAt || b.bidTime).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className="font-bold text-red-600">
                      {b.bidAmount.toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Chưa có lịch sử đấu giá nào.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
