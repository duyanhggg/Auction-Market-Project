// [TV2] File gốc cấu hình hệ thống React Router định tuyến liên kết các Trang
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './routes/ProtectedRoute';

// 6 Màn hình chính
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateProduct from './pages/CreateProduct';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 text-slate-800">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Công khai */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetail />} />

              {/* Tuyến đường được bảo vệ (Bắt buộc đăng nhập) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/create-product" element={<CreateProduct />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

              {/* 404 Not Found */}
              <Route
                path="*"
                element={
                  <div className="text-center py-24">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404</h1>
                    <p className="text-gray-500 mb-6">Trang bạn tìm kiếm không tồn tại.</p>
                    <a
                      href="/"
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-md"
                    >
                      Quay về Trang chủ
                    </a>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
