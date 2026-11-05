# STYLISTE — Web thương hiệu Stylist cá nhân

Dự án gồm 2 phần:

- **`frontend/`** — React (Vite + Tailwind CSS), giao diện đẹp, trẻ trung, năng động.
- **`backend/`** — Google Apps Script, dùng Google Sheets làm database, Google Drive lưu ảnh/video. Miễn phí, không cần thuê server.

## Thứ tự nội dung theo yêu cầu

1. **Feed ảnh & video** (ưu tiên hiển thị đầu tiên ở trang chủ) — admin đăng ảnh/video kèm chú thích, mô tả, hashtag để thu hút người xem.
2. **Sản phẩm** — mỗi sản phẩm thuộc 1 danh mục (Quần, Áo, Giày, Dép, Phụ kiện... admin tự thêm danh mục), có 4–6 ảnh và 1 link Shopee (affiliate) để người xem bấm mua trực tiếp.
3. **Bài viết** — nội dung chia sẻ bổ sung.

Admin quản lý toàn bộ nội dung trên tại khu vực `/admin` (yêu cầu đăng nhập).

## Bắt đầu từ đâu?

1. **Deploy backend trước** → làm theo `backend/README.md` để lấy URL Web App.
2. **Chạy frontend** → làm theo `frontend/README.md`, dán URL vừa lấy vào `.env`.
3. Đăng nhập `/admin` bằng tài khoản mặc định trong `backend/README.md`, **đổi mật khẩu ngay**, sau đó bắt đầu thêm danh mục → đăng feed → thêm sản phẩm → viết bài.

## Công nghệ sử dụng

| Phần | Công nghệ |
|---|---|
| Frontend | React 18, React Router, Tailwind CSS, Vite |
| Backend | Google Apps Script (JavaScript) |
| Database | Google Sheets |
| Lưu trữ media | Google Drive |
| Hosting frontend gợi ý | Vercel / Netlify / Cloudflare Pages (miễn phí) |

## Deploy lên Cloudflare Workers

Trong **Workers & Pages → Worker → Settings → Builds**, đặt:

- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`

Lệnh build cài dependencies frontend và tạo `frontend/dist`; lệnh deploy kế tiếp upload Worker cùng assets.
SPA fallback do `src/worker.js` xử lý; không thêm catch-all `/* /index.html 200` vào `_redirects` vì Cloudflare sẽ từ chối rule tạo vòng lặp.

## Gợi ý mở rộng sau này

- Thêm phân trang / tải thêm (load more) khi Feed và Sản phẩm nhiều dữ liệu.
- Thêm ô tìm kiếm sản phẩm theo tên.
- Thêm sắp xếp thứ tự hiển thị thủ công cho danh mục/sản phẩm (kéo-thả).
- Thêm thống kê lượt click vào link Shopee để theo dõi hiệu quả affiliate.
