# Hướng dẫn nhập dữ liệu mẫu cho STYLISTE

File `frontend/src/data/seed-data.json` chứa dữ liệu mẫu chuẩn cho 4 thực thể:

| Thực thể | Số lượng mẫu | Mô tả |
|----------|-------------|-------|
| Categories (Danh mục) | 5 | Áo, Quần, Giày, Dép, Phụ kiện |
| Feed (Ảnh & video) | 6 | Outfit thời trang mixes ảnh & video |
| Products (Sản phẩm) | 6 | Sản phẩm thời trang có link Shopee |
| Posts (Bài viết) | 3 | Bài viết chia sẻ kinh nghiệm thời trang |

Tất cả ảnh dùng từ [Unsplash](https://unsplash.com) — miễn phí, không cần bản quyền.

## Cách 1: Nhập qua trang quản trị (Khuyên dùng)

1. Đăng nhập vào `/admin/login`
   - Tài khoản mặc định: `admin` / `ThayDoiMatKhauNay123` (nhớ đổi ngay sau khi setup)
2. Vào từng mục quản trị:
   - **Danh mục** → thêm 5 danh mục ở trên
   - **Feed ảnh & video** → thêm 6 bài feed (chọn `type` = `image` hoặc `video`)
   - **Sản phẩm** → thêm 6 sản phẩm (chọn `categoryId` tương ứng, điền `shopeeLink`)
   - **Bài viết** → thêm 3 bài viết (điền `title`, `excerpt`, `content`, `coverImage`)

## Cách 2: Nhập trực tiếp vào Google Sheet

Mở Google Sheet được liên kết với backend Apps Script, thêm từng hàng vào các sheet theo thứ tự cột:

### Sheet: Categories
| cột | Tên | Ví dụ |
|-----|-----|-------|
| A | id | cat-ao |
| B | name | Áo |
| C | createdAt | 2026-01-10T00:00:00Z |

### Sheet: Feed
| cột | Tên | Ví dụ |
|-----|-----|-------|
| A | id | feed-001 |
| B | type | image |
| C | mediaUrl | https://images.unsplash.com/... |
| D | caption | Áo blazer oversize... |
| E | description | Lớp lớp ton sur ton... |
| F | tags | blazer,beje,oversize |
| G | createdAt | 2026-05-10T08:30:00Z |

### Sheet: Products
| cột | Tên | Ví dụ |
|-----|-----|-------|
| A | id | prod-001 |
| B | categoryId | cat-ao |
| C | name | Áo blazer oversize beje |
| D | description | Áo blazer cadesh oversize... |
| E | price | 850000 |
| F | images | url1,url2 (phân cách bởi dấu phẩy) |
| G | shopeeLink | https://shopee.vn/... |
| H | createdAt | 2026-04-20T00:00:00Z |

### Sheet: Posts
| cột | Tên | Ví dụ |
|-----|-----|-------|
| A | id | post-001 |
| B | title | Cách chọn áo blazer... |
| C | excerpt | Blazer không chỉ dành... |
| D | content | ## Blazer cho dáng... (có thể dùng Markdown) |
| E | coverImage | https://images.unsplash.com/... |
| F | createdAt | 2026-04-15T00:00:00Z |

## Lưu ý

- Dữ liệu mẫu chỉ làm tham khảo, bạn có thể chỉnh sửa, thêm bớt hoặc xóa toàn bộ sau khi nhập.
- Khi nhập qua Admin panel, mỗi lần nhấn "Thêm" sẽ gọi API `addFeedItem`, `addProduct`, `addPost` hoặc `addCategory` tương ứng.
- Nếu nhập qua Google Sheet, dữ liệu sẽ hiển thị ngay trên web sau khi tải lại trang (vì frontend gọi `getFeed`, `getProducts`, `getPosts`, `getCategories` khi mount).
