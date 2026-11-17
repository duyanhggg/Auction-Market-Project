// client/src/pages/CreateProduct.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CreateProduct() {
  const { token } = useAuth();     // Lấy JWT token để gửi lên API
  const navigate = useNavigate();

  // State lưu dữ liệu form
  const [form, setForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    startingPrice: '',
    bidStep: '',
    endTime: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cập nhật field khi người dùng gõ
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,   // Gửi token xác thực
        },
        body: JSON.stringify({
          ...form,
          startingPrice: Number(form.startingPrice),
          bidStep: Number(form.bidStep),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng bán thất bại');
      }

      // Thành công → chuyển đến trang chi tiết sản phẩm vừa tạo
      navigate(`/products/${data.data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Tính giá trị min cho input datetime-local (không cho chọn thời gian quá khứ)
  const minDateTime = new Date(Date.now() + 60000) // Tối thiểu 1 phút sau
    .toISOString()
    .slice(0, 16);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📦 Đăng Bán Đồ Cũ</h2>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Tên sản phẩm */}
        <label style={styles.label}>Tên sản phẩm *</label>
        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="VD: Xe đạp cũ hiệu Giant"
          value={form.name}
          onChange={handleChange}
          required
        />

        {/* Mô tả */}
        <label style={styles.label}>Mô tả tình trạng *</label>
        <textarea
          style={{ ...styles.input, height: '100px', resize: 'vertical' }}
          name="description"
          placeholder="Mô tả chi tiết tình trạng, năm sản xuất, lý do bán..."
          value={form.description}
          onChange={handleChange}
          required
        />

        {/* URL ảnh */}
        <label style={styles.label}>Link ảnh sản phẩm</label>
        <input
          style={styles.input}
          type="url"
          name="imageUrl"
          placeholder="https://example.com/anh-san-pham.jpg"
          value={form.imageUrl}
          onChange={handleChange}
        />

        {/* Giá khởi điểm và bước giá — 2 cột */}
        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Giá khởi điểm (VNĐ) *</label>
            <input
              style={styles.input}
              type="number"
              name="startingPrice"
              placeholder="VD: 500000"
              min="0"
              value={form.startingPrice}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Bước giá tối thiểu (VNĐ) *</label>
            <input
              style={styles.input}
              type="number"
              name="bidStep"
              placeholder="VD: 50000"
              min="1000"
              value={form.bidStep}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Thời gian đóng phiên */}
        <label style={styles.label}>Thời gian đóng phiên đấu giá *</label>
        <input
          style={styles.input}
          type="datetime-local"
          name="endTime"
          min={minDateTime}
          value={form.endTime}
          onChange={handleChange}
          required
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Đang đăng...' : '🚀 Đăng bán ngay'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '640px',
    margin: '40px auto',
    padding: '32px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '24px',
    color: '#b71c1c',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginTop: '8px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  button: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#b71c1c',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  error: {
    color: '#b71c1c',
    backgroundColor: '#ffebee',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '12px',
  },
};