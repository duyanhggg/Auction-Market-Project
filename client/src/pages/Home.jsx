// [TV4] Trang chủ: Thanh tìm kiếm, danh mục, list sản phẩm đồ cũ phân trang
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useFilterStore } from '../store/filterStore';

export default function Home() {
  const { keyword, minPrice, maxPrice, page, setKeyword, setPriceRange, setPage, resetFilters } = useFilterStore();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(keyword);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      params.append('page', page);
      params.append('limit', 8);

      const res = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword, minPrice, maxPrice, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
  };

  const handleFilterPrice = (e) => {
    e.preventDefault();
    setPriceRange(localMin, localMax);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner Giới thiệu */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-8 mb-8 shadow-lg">
        <h1 className="text-3xl font-extrabold mb-2 text-amber-400">
          Sàn Đấu Giá Đồ Cũ Tiết Kiệm & Minh Bạch
        </h1>
        <p className="text-gray-300 max-w-2xl">
          Tìm kiếm những món đồ cũ chất lượng với mức giá bạn tự quyết định. Tham gia đấu giá thời gian thực ngay hôm nay!
        </p>
      </div>

      {/* Thanh công cụ: Tìm kiếm & Lọc */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        {/* Tìm kiếm */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo tên sản phẩm, mô tả đồ cũ..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-5 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Lọc khoảng giá */}
        <form onSubmit={handleFilterPrice} className="flex items-center gap-2">
          <input
            type="number"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            placeholder="Giá từ"
            className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            placeholder="Đến giá"
            className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Lọc
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchInput('');
              setLocalMin('');
              setLocalMax('');
              resetFilters();
            }}
            className="text-gray-500 hover:text-red-500 text-xs px-2"
          >
            Đặt lại
          </button>
        </form>
      </div>

      {/* Danh sách sản phẩm */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-10">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Trước
              </button>
              <span className="text-sm text-gray-600 font-medium">
                Trang {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Sau
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500 text-base">Hiện không có sản phẩm nào phù hợp với tìm kiếm của bạn.</p>
        </div>
      )}
    </div>
  );
}
