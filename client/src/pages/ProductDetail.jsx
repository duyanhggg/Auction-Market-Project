import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL (VD: /products/:id)
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Giả lập hoặc gọi API lấy thông tin sản phẩm từ Backend
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể tải sản phẩm');
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  // Xử lý gửi giá đấu giá lên server (Tính năng của TV3)
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch(`http://localhost:5000/api/bids/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(bidAmount) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đặt giá thất bại');

      setSuccessMsg('Đấu giá thành công! Giá hiện tại đã được cập nhật.');
      setProduct((prev) => ({ ...prev, currentPrice: Number(bidAmount) }));
      setBidAmount('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải thông tin sản phẩm...</div>;

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '650px', textAlign: 'left' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ marginBottom: '16px', padding: '6px 12px', cursor: 'pointer' }}
        >
          ← Quay lại
        </button>

        {error && <div className="error-msg">{error}</div>}
        {successMsg && <div className="success-msg">{successMsg}</div>}

        {product ? (
          <div>
            <h2 style={{ color: '#b71c1c', marginBottom: '12px' }}>{product.title}</h2>
            <p style={{ marginBottom: '10px' }}><strong>Mô tả:</strong> {product.description}</p>
            <p style={{ marginBottom: '10px' }}><strong>Giá khởi điểm:</strong> {product.startingPrice?.toLocaleString()} VNĐ</p>
            <p style={{ marginBottom: '16px', fontSize: '18px', color: '#d32f2f' }}>
              <strong>Giá hiện tại:</strong> {product.currentPrice?.toLocaleString()} VNĐ
            </p>

            <form onSubmit={handlePlaceBid} style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
              <div className="form-group">
                <label>Nhập mức giá muốn đấu giá (VNĐ)</label>
                <input
                  type="number"
                  min={product.currentPrice + 1000}
                  required
                  placeholder={`Nhập > ${product.currentPrice}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary">
                Xác nhận Đặt Giá
              </button>
            </form>
          </div>
        ) : (
          <p>Không tìm thấy thông tin sản phẩm.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;