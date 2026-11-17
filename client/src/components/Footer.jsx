// client/src/components/Footer.jsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        © {year} Đấu Giá Đồ Cũ — Bài tập lớn Lập trình Web
      </p>
      <p style={styles.sub}>
        Mua bán đồ cũ minh bạch · Đấu giá công bằng · An toàn thanh toán
      </p>
    </footer>
  );
}

const styles = {
  footer: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#212121',
    color: '#bdbdbd',
    marginTop: 'auto',
  },
  text: { margin: '0 0 4px', fontSize: '14px' },
  sub: { margin: 0, fontSize: '12px', color: '#757575' },
};