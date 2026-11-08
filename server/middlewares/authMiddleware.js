// [TV1] Kiểm tra, giải mã token JWT (verifyToken), phân quyền Admin
const jwt = require('jsonwebtoken');

// Middleware xác thực token đăng nhập
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không tìm thấy token hoặc định dạng không hợp lệ' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, ... }
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// Middleware kiểm tra quyền Admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
};
