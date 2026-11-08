// [TV2] Chân trang thông tin bản quyền ứng dụng
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-400 py-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Nền tảng Đấu Giá Đồ Cũ Trực Tuyến. Nhóm BTL Web.
        </p>
        <p className="text-xs text-gray-500">
          Dự án phục vụ học phần Phát triển Ứng dụng Web - MERN Stack (MongoDB, Express, React, Node.js).
        </p>
      </div>
    </footer>
  );
}
