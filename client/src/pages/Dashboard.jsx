import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api/auth';

const Dashboard = () => {
  const { user, token, updateUserContext, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      updateUserContext(data.user);
      setMessage('Cập nhật hồ sơ thành công!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này?')) return;

    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        logout();
        navigate('/login');
      }
    } catch {
      setError('Không thể xóa tài khoản lúc này');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '560px' }}>
        <h2>Bảng Điều Khiển Cá Nhân</h2>
        <p style={{ marginBottom: '16px', color: '#555', textAlign: 'center' }}>
          Xin chào, <strong>{user?.fullName}</strong>
          <span className="role-badge">{user?.role}</span>
        </p>

        {message && <div className="success-msg">{message}</div>}
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Email đăng nhập (Không thể thay đổi)</label>
            <input type="email" value={user?.email || ''} disabled />
          </div>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ giao nhận</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary">
            Lưu thay đổi thông tin
          </button>
        </form>

        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
          <button
            onClick={logout}
            className="btn-danger"
            style={{ backgroundColor: '#616161', flex: 1 }}
          >
            Đăng xuất
          </button>
          <button onClick={handleDeleteAccount} className="btn-danger" style={{ flex: 1 }}>
            Xóa tài khoản
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
