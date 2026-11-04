# Backend — Google Apps Script

Backend dùng **Google Sheets** làm cơ sở dữ liệu và **Google Drive** để lưu ảnh/video, chạy hoàn toàn miễn phí trên hạ tầng Google.

## Cấu trúc dữ liệu

| Sheet | Cột |
|---|---|
| `Categories` | id, name, createdAt |
| `Products` | id, categoryId, name, description, price, images (URL cách nhau bởi dấu phẩy), shopeeLink, createdAt |
| `Feed` | id, type (`image`/`video`), mediaUrl, caption, description, tags, createdAt |
| `Posts` | id, title, excerpt, content, coverImage, createdAt |
| `Admin` | username, passwordHash (SHA-256) |
| `Sessions` | token, username, expiresAt |

## Các bước triển khai

1. Vào [sheets.google.com](https://sheets.google.com), tạo một **Google Sheet mới** (đặt tên tuỳ ý, ví dụ "Styliste Database").
2. Menu **Extensions (Tiện ích mở rộng) → Apps Script**.
3. Xoá hết code mẫu trong `Code.gs`, dán toàn bộ nội dung file `Code.gs` trong thư mục này vào.
4. Ở thanh trên cùng trình soạn thảo, bấm biểu tượng **⚙️ Project Settings**, bật **"Show appsscript.json manifest file in editor"**. Quay lại tab code, mở file `appsscript.json` vừa hiện ra và thay nội dung bằng file `appsscript.json` đi kèm ở đây.
5. Ở thanh chọn hàm (dropdown cạnh nút ▶ Run), chọn hàm **`setupProject`**, bấm **Run**.
   - Lần đầu chạy, Google sẽ yêu cầu cấp quyền → bấm **Review permissions** → chọn tài khoản → **Advanced → Go to (tên project) (unsafe)** → **Allow**. Đây là quy trình bình thường với script tự viết.
   - Sau khi chạy xong, xem **Executions log**, sẽ thấy tài khoản admin mặc định (`admin` / `ThayDoiMatKhauNay123`).
6. **Đổi mật khẩu ngay**: chọn hàm `changeAdminPassword`, sửa dòng gọi hàm tạm thời hoặc chạy trực tiếp trong tab **Execution** với tham số là mật khẩu mới của bạn (cách nhanh nhất: vào tab Console/Execute, chọn hàm, nhập tham số dạng chuỗi, ví dụ `"MatKhauMoiCuaToi!"`), rồi bấm Run.
7. **Deploy**: nút **Deploy → New deployment**.
   - Chọn loại: **Web app**.
   - Execute as: **Me**.
   - Who has access: **Anyone**.
   - Bấm **Deploy**, cấp quyền lần nữa nếu được hỏi.
8. Copy **Web app URL** (kết thúc bằng `/exec`) — đây chính là `VITE_API_URL` cần dán vào file `.env` của phần frontend.

## Cập nhật code sau này

Mỗi khi bạn sửa `Code.gs` và muốn áp dụng, vào **Deploy → Manage deployments → biểu tượng bút chì (Edit)** trên deployment hiện có → chọn **Version: New version** → **Deploy**. Việc này giữ nguyên URL `/exec` đang dùng, không cần cập nhật lại frontend.

## Ghi chú

- Ảnh/video được lưu trong thư mục Drive tên **`Styliste_Media`**, chia sẻ ở chế độ "Anyone with the link".
- Hệ thống đăng nhập đơn giản, phù hợp 1 tài khoản admin. Token phiên hết hạn sau 72 giờ (chỉnh ở hằng số `TOKEN_TTL_HOURS` trong `Code.gs`).
- Muốn thêm tài khoản admin thứ hai: mở sheet `Admin`, thêm 1 dòng mới (username, và passwordHash — có thể tạo hash bằng cách gọi tạm `Logger.log(hashPassword_("mat_khau"))` trong trình soạn thảo).
