// client/src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // Trạng thái menu mobile
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <nav style={styles.nav}>
      {/* Logo / Tên app */}
      <Link to="/" style={styles.logo}>
        🏷️ Đấu Giá Đồ Cũ
      </Link>
      {/* Nút hamburger (Mobile) */}
      <button
        style={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      {/* Menu links */}
      <div style={{ ...styles.menu, display: menuOpen ? 'flex' : undefined }}
           className="nav-menu">
        <Link to="/" style={styles.link} onClick={() => setMenuOpen(false)}>
          Trang chủ
        </Link>
        {!isAuthenticated ? (
          <>
            <Link to="/login" style={styles.link} onClick={() => setMenuOpen(false)}>
              Đăng nhập
            </Link>
            <Link to="/register" style={styles.link} onClick={() => setMenuOpen(false)}>
              Đăng ký
            </Link>
          </>
        ) : (
          <>
            <Link to="/create-product" style={styles.link} onClick={() => setMenuOpen(false)}>
              + Đăng bán
            </Link>
            <Link to="/dashboard" style={styles.link} onClick={() => setMenuOpen(false)}>
              Tài khoản
            </Link>
            <span style={styles.greeting}>Xin chào, <strong>{user?.fullName}</strong></span>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Đăng xuất
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
// Inline styles đơn giản — có thể thay bằng Tailwind CSS
const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: '12px 24px',
    backgroundColor: '#b71c1c',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  hamburger: {
    display: 'none',           // Ẩn trên desktop
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
    // CSS media query cần viết trong index.css — xem ghi chú bên dưới
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '15px',
  },
  greeting: {
    color: '#ffcdd2',
    fontSize: '14px',
  },
  logoutBtn: {
    padding: '6px 14px',
    background: '#fff',
    color: '#b71c1c',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};