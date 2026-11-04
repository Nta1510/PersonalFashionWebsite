# Frontend — React (Vite + Tailwind)

Giao diện web thương hiệu stylist cá nhân: Feed ảnh/video (ưu tiên #1) → Sản phẩm kèm link Shopee (ưu tiên #2) → Bài viết (ưu tiên #3), cùng khu vực Admin để quản trị toàn bộ nội dung.

## Cài đặt

```bash
cd frontend
npm install
cp .env.example .env
```

Mở file `.env`, dán URL Web App Apps Script (xem `backend/README.md`) vào biến `VITE_API_URL`.

## Chạy thử (development)

```bash
npm run dev
```

Mở trình duyệt tại địa chỉ hiện trong terminal (mặc định `http://localhost:5173`).

## Build bản chính thức

```bash
npm run build
```

Kết quả nằm trong thư mục `dist/` — bạn có thể upload thư mục này lên bất kỳ dịch vụ hosting tĩnh nào: **Vercel, Netlify, Cloudflare Pages, Firebase Hosting, GitHub Pages...** (đều có gói miễn phí).

## Cấu trúc trang

- `/` — Trang chủ: hero + Feed ảnh/video dạng lưới masonry (nội dung ưu tiên hiển thị đầu tiên).
- `/feed/:id` — Chi tiết 1 bài feed.
- `/san-pham` — Danh sách sản phẩm, lọc theo danh mục.
- `/san-pham/:id` — Chi tiết sản phẩm: gallery 4–6 ảnh + nút "Mua trên Shopee".
- `/bai-viet`, `/bai-viet/:id` — Bài viết chia sẻ.
- `/gioi-thieu` — Giới thiệu.
- `/admin/login` — Đăng nhập quản trị.
- `/admin` — Tổng quan.
- `/admin/danh-muc` — Quản lý danh mục (Quần, Áo, Giày, Dép...).
- `/admin/feed` — Đăng/quản lý ảnh & video (ưu tiên #1).
- `/admin/san-pham` — Đăng/quản lý sản phẩm + link Shopee (ưu tiên #2).
- `/admin/bai-viet` — Đăng/quản lý bài viết (ưu tiên #3).

## Thiết kế

- Font chữ: **Fraunces** (tiêu đề, chất tạp chí thời trang) + **Plus Jakarta Sans** (nội dung).
- Bảng màu: nền trắng ngà `#FAF6FF`, chữ mực đậm `#16121A`, điểm nhấn gradient hồng cam san → tím `#FF4D6D → #7B2FF7`.
- Trang admin dùng nền tối riêng để phân biệt rõ với trang công khai.
