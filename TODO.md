# 📋 TODO LIST - DỰ ÁN WEBSITE ĐẤU GIÁ ĐỒ CŨ (BTL WEB)

> **Mô hình kiến trúc:** MERN Stack (MongoDB, Express, React, Node.js)
> - **Backend:** `server/` (Node.js + Express)
> - **Frontend:** `client/` (React + Vite + Tailwind CSS)

---

## 👥 PHÂN CÔNG CÔNG VIỆC THEO THÀNH VIÊN

### 👤 THÀNH VIÊN 1 (TV1): Xác thực, Người dùng & Bảo vệ hệ thống
- [ ] **Backend - Auth:**
  - [ ] `server/models/User.js`: Schema người dùng (`fullName`, `email`, `password`, `role`).
  - [ ] `server/controllers/authController.js`: Đăng ký tài khoản (mã hóa mật khẩu với `bcryptjs`), Đăng nhập (sinh JWT token).
  - [ ] `server/routes/authRoutes.js`: Định tuyến `POST /api/auth/register`, `POST /api/auth/login`.
- [ ] **Backend - Middleware:**
  - [ ] `server/middlewares/authMiddleware.js`: `verifyToken` kiểm tra JWT header, `isAdmin` phân quyền.
  - [ ] `server/middlewares/errorMiddleware.js`: Bắt và xử lý lỗi tập trung `errorHandler`.
- [ ] **Frontend - Auth:**
  - [ ] `client/src/context/AuthContext.jsx`: Quản lý state đăng nhập toàn ứng dụng, lưu trữ token/user.
  - [ ] `client/src/routes/ProtectedRoute.jsx`: Bảo vệ tuyến đường riêng tư (chặn khi chưa đăng nhập).
  - [ ] `client/src/pages/Login.jsx`: Màn hình Đăng nhập.
  - [ ] `client/src/pages/Register.jsx`: Màn hình Đăng ký tài khoản.

---

### 👤 THÀNH VIÊN 2 (TV2): Quản lý Sản phẩm Đồ Cũ (CRUD) & Layout Tổng thể
- [ ] **Backend - Product CRUD:**
  - [ ] `server/models/Product.js`: Schema sản phẩm (`name`, `description`, `imageUrl`, `startingPrice`, `currentPrice`, `bidStep`, `endTime`, `sellerId`, `status`).
  - [ ] `server/controllers/productController.js`: CRUD sản phẩm đồ cũ, validate thời gian kết thúc > thời gian hiện tại.
  - [ ] `server/routes/productRoutes.js`: API Thêm/Sửa/Xóa sản phẩm, lấy chi tiết 1 sản phẩm.
- [ ] **Frontend - Điều hướng & Đăng bán:**
  - [ ] `client/src/App.jsx`: Cấu hình React Router liên kết các trang và bọc `AuthProvider`.
  - [ ] `client/src/components/Navbar.jsx`: Menu điều hướng responsive, nút đăng nhập/đăng xuất theo trạng thái.
  - [ ] `client/src/components/Footer.jsx`: Chân trang thông tin bản quyền ứng dụng.
  - [ ] `client/src/pages/CreateProduct.jsx`: Màn hình Đăng bán đồ cũ (form nhập thông tin, chọn ngày giờ đóng phiên).

---

### 👤 THÀNH VIÊN 3 (TV3): Thuật toán Đấu Giá & Đồng hồ Đếm ngược Thời gian thực
- [ ] **Backend - Bidding Logic:**
  - [ ] `server/models/Bid.js`: Schema lượt ra giá (`productId`, `bidderId`, `bidAmount`, `bidTime`).
  - [ ] `server/controllers/bidController.js`: Thuật toán đặt giá:
    - [ ] Chặn người bán tự đấu giá món đồ của mình.
    - [ ] Chặn đặt giá khi phiên đã kết thúc hoặc không ở trạng thái `active`.
    - [ ] Chặn giá đặt thấp hơn giá yêu cầu (`currentPrice` + `bidStep`).
    - [ ] Cập nhật `currentPrice` và `currentBidderId` của sản phẩm.
  - [ ] `server/routes/bidRoutes.js`: `POST /api/bids` và `GET /api/bids/product/:productId`.
- [ ] **Frontend - Giao diện Đấu giá:**
  - [ ] `client/src/components/CountdownTimer.jsx`: Bộ đếm ngược thời gian thực, tự khóa nút khi hết giờ.
  - [ ] `client/src/pages/ProductDetail.jsx`: Chi tiết sản phẩm, hiển thị giá cao nhất, countdown, ô nhập tiền đặt giá, bảng lịch sử ra giá.

---

### 👤 THÀNH VIÊN 4 (TV4): Tìm kiếm, Lọc giá, Phân trang & Trang Dashboard cá nhân
- [ ] **Backend - Filter & Dashboard:**
  - [ ] `server/controllers/productController.js`: Tìm kiếm theo từ khóa regex, lọc theo khoảng giá, phân trang `skip/limit`.
  - [ ] `server/controllers/dashboardController.js`:
    - [ ] Danh sách đồ người dùng đã đăng bán.
    - [ ] Danh sách các phiên đang tham gia và đang dẫn đầu giá.
    - [ ] Danh sách các sản phẩm đã đấu giá thắng cuộc.
    - [ ] Lịch sử toàn bộ các lượt đặt giá cá nhân.
  - [ ] `server/routes/dashboardRoutes.js`: Định tuyến `GET /api/users/dashboard`.
- [ ] **Frontend - Trang Chủ & Dashboard:**
  - [ ] `client/src/store/filterStore.js`: Quản lý state bộ lọc tìm kiếm, khoảng giá, số trang.
  - [ ] `client/src/components/ProductCard.jsx`: Thẻ hiển thị sản phẩm trang chủ (ảnh, giá hiện tại, countdown).
  - [ ] `client/src/pages/Home.jsx`: Trang chủ với thanh tìm kiếm, bộ lọc giá, grid sản phẩm, phân trang.
  - [ ] `client/src/pages/Dashboard.jsx`: Trang Quản lý cá nhân hiển thị 4 tab thống kê.

---

## ⚙️ CÁC TỆP DÙNG CHUNG ĐÃ CẤU HÌNH
- [x] `server/config/db.js`: Kết nối MongoDB Atlas
- [x] `server/server.js`: Khởi chạy Express, CORS, tích hợp các routes
- [x] `server/.env`: Biến môi trường mẫu
- [x] `server/.gitignore`: Chặn `node_modules` và `.env`
- [x] `client/.gitignore`: Chặn `node_modules`, `dist`, `.env`
- [x] `.gitignore` (Root): Chặn toàn bộ `node_modules`, `.env`, build files ở tất cả thư mục
- [x] `client/src/index.css`: Cấu hình reset CSS
- [x] `client/index.html`: Cấu hình tiêu đề và tích hợp Tailwind CSS
