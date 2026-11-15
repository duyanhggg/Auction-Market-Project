import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#b71c1c' }}>
        Đấu Giá Chợ Đồ Cũ
      </div>
      <div className="nav-links">
        {!isAuthenticated ? (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </>
        ) : (
          <>
            <span>Xin chào, <strong>{user?.fullName}</strong></span>
            <Link to="/dashboard">Bảng điều khiển</Link>
            <button
              onClick={logout}
              style={{
                padding: '6px 12px',
                background: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Đăng xuất
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Trang chủ mặc định chuyển hướng về /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Các trang xác thực công khai */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Các trang bảo vệ yêu cầu đăng nhập */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products/:id" element={<ProductDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;