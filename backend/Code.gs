/**
 * STYLISTE — Backend (Google Apps Script)
 * -----------------------------------------------------------------------
 * Dùng Google Sheets làm cơ sở dữ liệu và Google Drive làm nơi lưu ảnh/video.
 *
 * CÀI ĐẶT NHANH:
 * 1. Tạo 1 Google Sheet mới, mở Extensions > Apps Script, dán toàn bộ nội
 *    dung file Code.gs này vào (xoá code mẫu có sẵn).
 * 2. Dán nội dung file appsscript.json (mở qua biểu tượng bánh răng >
 *    "Show appsscript.json" trong trình soạn thảo Apps Script).
 * 3. Trong trình soạn thảo, chọn hàm `setupProject` ở thanh chọn hàm, bấm
 *    Run 1 lần để tự tạo các sheet + thư mục Drive lưu media + tài khoản
 *    admin mặc định (xem hằng số DEFAULT_ADMIN bên dưới — nhớ đổi mật khẩu).
 * 4. Deploy > New deployment > chọn loại "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 5. Copy URL kết thúc bằng /exec, dán vào file .env của frontend
 *    (VITE_API_URL=...).
 *
 * LƯU Ý BẢO MẬT: đây là giải pháp đơn giản phù hợp cho 1 admin duy nhất.
 * Mật khẩu được lưu dạng văn bản trong sheet Admin (theo yêu cầu), token phiên
 * đăng nhập được lưu trong sheet Sessions và hết hạn sau TOKEN_TTL_HOURS giờ.
 */

// ============================= CẤU HÌNH =============================
const SHEET_NAMES = {
  CATEGORIES: 'Categories',
  PRODUCTS: 'Products',
  FEED: 'Feed',
  POSTS: 'Posts',
  ADMIN: 'Admin',
  SESSIONS: 'Sessions'
};

const DRIVE_FOLDER_NAME = 'Styliste_Media';
const TOKEN_TTL_HOURS = 72;

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'ThayDoiMatKhauNay123' // Đổi ngay sau khi chạy setupProject()
};

// ============================= ENTRY POINTS =============================

function doGet(e) {
  try {
    const action = e.parameter.action;
    let data;
    switch (action) {
      case 'getCategories':
        data = getCategories();
        break;
      case 'getFeed':
        data = getFeed();
        break;
      case 'getFeedItem':
        data = getFeedItem(e.parameter.id);
        break;
      case 'getProducts':
        data = getProducts();
        break;
      case 'getProduct':
        data = getProduct(e.parameter.id);
        break;
      case 'getPosts':
        data = getPosts();
        break;
      case 'getPost':
        data = getPost(e.parameter.id);
        break;
      case 'getAdmin':
        data = getAdmin();
        break;
      default:
        throw new Error('Hành động không hợp lệ: ' + action);
    }
    return jsonOk(data);
  } catch (err) {
    return jsonError(err);
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;

    // --- Đăng nhập không cần token ---
    if (action === 'login') {
      return jsonOk(login(body.username, body.password));
    }

    // --- Mọi hành động ghi dữ liệu khác đều cần token hợp lệ ---
    const session = requireAuth(body.token);

    let data;
    switch (action) {
      case 'logout':
        data = logout(body.token);
        break;

      case 'addCategory':
        data = addCategory(body);
        break;
      case 'updateCategory':
        data = updateCategory(body);
        break;
      case 'deleteCategory':
        data = deleteCategory(body.id);
        break;

      case 'addFeedItem':
        data = addFeedItem(body);
        break;
      case 'updateFeedItem':
        data = updateFeedItem(body);
        break;
      case 'deleteFeedItem':
        data = deleteFeedItem(body.id);
        break;

      case 'addProduct':
        data = addProduct(body);
        break;
      case 'updateProduct':
        data = updateProduct(body);
        break;
      case 'deleteProduct':
        data = deleteProduct(body.id);
        break;

      case 'addPost':
        data = addPost(body);
        break;
      case 'updatePost':
        data = updatePost(body);
        break;
      case 'deletePost':
        data = deletePost(body.id);
        break;

      case 'uploadMedia':
        data = uploadMedia(body.fileName, body.mimeType, body.base64Data);
        break;

      case 'updateAdmin':
        data = updateAdmin(body);
        break;

      default:
        throw new Error('Hành động không hợp lệ: ' + action);
    }
    return jsonOk(data);
  } catch (err) {
    return jsonError(err);
  }
}

// ============================= AUTH =============================


function login(username, password) {
  const sheet = getSheet_(SHEET_NAMES.ADMIN);
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === username && rows[i][1] === password) {
      const token = Utilities.getUuid();
      const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 3600 * 1000);
      getSheet_(SHEET_NAMES.SESSIONS).appendRow([token, username, expiresAt]);
      return { token, username };
    }
  }
  throw new Error('Sai tài khoản hoặc mật khẩu');
}

function logout(token) {
  const sheet = getSheet_(SHEET_NAMES.SESSIONS);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === token) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
  return { success: true };
}

function requireAuth(token) {
  if (!token) throw new Error('Chưa đăng nhập');
  const sheet = getSheet_(SHEET_NAMES.SESSIONS);
  const rows = sheet.getDataRange().getValues();
  const now = new Date();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === token) {
      const expiresAt = new Date(rows[i][2]);
      if (expiresAt < now) throw new Error('Phiên đăng nhập đã hết hạn');
      return { username: rows[i][1] };
    }
  }
  throw new Error('Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại');
}

// ============================= CATEGORIES =============================

function getCategories() {
  return sheetToObjects_(getSheet_(SHEET_NAMES.CATEGORIES));
}

function addCategory(body) {
  const sheet = getSheet_(SHEET_NAMES.CATEGORIES);
  const id = Utilities.getUuid();
  sheet.appendRow([id, body.name, new Date()]);
  return { id };
}

function updateCategory(body) {
  updateRowById_(SHEET_NAMES.CATEGORIES, body.id, { name: body.name });
  return { success: true };
}

function deleteCategory(id) {
  deleteRowById_(SHEET_NAMES.CATEGORIES, id);
  return { success: true };
}

// ============================= FEED (ảnh & video) =============================

function getFeed() {
  const items = sheetToObjects_(getSheet_(SHEET_NAMES.FEED));
  return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getFeedItem(id) {
  const item = getFeed().find((f) => String(f.id) === String(id));
  if (!item) throw new Error('Không tìm thấy nội dung');
  return item;
}

function addFeedItem(body) {
  const sheet = getSheet_(SHEET_NAMES.FEED);
  const id = Utilities.getUuid();
  sheet.appendRow([
    id,
    body.type || 'image',
    body.mediaUrl,
    body.caption || '',
    body.description || '',
    body.tags || '',
    new Date()
  ]);
  return { id };
}

function updateFeedItem(body) {
  updateRowById_(SHEET_NAMES.FEED, body.id, {
    type: body.type,
    mediaUrl: body.mediaUrl,
    caption: body.caption,
    description: body.description,
    tags: body.tags
  });
  return { success: true };
}

function deleteFeedItem(id) {
  deleteRowById_(SHEET_NAMES.FEED, id);
  return { success: true };
}

// ============================= PRODUCTS =============================

function getProducts() {
  const products = sheetToObjects_(getSheet_(SHEET_NAMES.PRODUCTS));
  const categories = getCategories();
  const catMap = {};
  categories.forEach((c) => (catMap[c.id] = c.name));
  return products
    .map((p) => ({ ...p, categoryName: catMap[p.categoryId] || '' }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getProduct(id) {
  const product = getProducts().find((p) => String(p.id) === String(id));
  if (!product) throw new Error('Không tìm thấy sản phẩm');
  return product;
}

function addProduct(body) {
  const sheet = getSheet_(SHEET_NAMES.PRODUCTS);
  const id = Utilities.getUuid();
  sheet.appendRow([
    id,
    body.categoryId,
    body.name,
    body.description || '',
    body.price || '',
    body.images || '',
    body.shopeeLink || '',
    new Date()
  ]);
  return { id };
}

function updateProduct(body) {
  updateRowById_(SHEET_NAMES.PRODUCTS, body.id, {
    categoryId: body.categoryId,
    name: body.name,
    description: body.description,
    price: body.price,
    images: body.images,
    shopeeLink: body.shopeeLink
  });
  return { success: true };
}

function deleteProduct(id) {
  deleteRowById_(SHEET_NAMES.PRODUCTS, id);
  return { success: true };
}

// ============================= POSTS (bài viết) =============================

function getPosts() {
  const posts = sheetToObjects_(getSheet_(SHEET_NAMES.POSTS));
  return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getPost(id) {
  const post = getPosts().find((p) => String(p.id) === String(id));
  if (!post) throw new Error('Không tìm thấy bài viết');
  return post;
}

function addPost(body) {
  const sheet = getSheet_(SHEET_NAMES.POSTS);
  const id = Utilities.getUuid();
  sheet.appendRow([
    id,
    body.title,
    body.excerpt || '',
    body.content || '',
    body.coverImage || '',
    new Date()
  ]);
  return { id };
}

function updatePost(body) {
  updateRowById_(SHEET_NAMES.POSTS, body.id, {
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    coverImage: body.coverImage
  });
  return { success: true };
}

function deletePost(id) {
  deleteRowById_(SHEET_NAMES.POSTS, id);
  return { success: true };
}

// ============================= UPLOAD MEDIA (Drive) =============================

function uploadMedia(fileName, mimeType, base64Data) {
  const folder = getOrCreateMediaFolder_();
  const bytes = Utilities.base64Decode(base64Data);
  const blob = Utilities.newBlob(bytes, mimeType, fileName);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  // URL xem trực tiếp dạng ảnh/video nhúng được (không phải link "mở trong Drive")
  const url = 'https://lh3.googleusercontent.com/d/' + file.getId();
  return { url, fileId: file.getId() };
}

function getOrCreateMediaFolder_() {
  const it = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  if (it.hasNext()) return it.next();
  return DriveApp.createFolder(DRIVE_FOLDER_NAME);
}

// ============================= SETUP (chạy 1 lần) =============================

function setupProject() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  createSheetIfMissing_(ss, SHEET_NAMES.CATEGORIES, ['id', 'name', 'createdAt']);
  createSheetIfMissing_(ss, SHEET_NAMES.PRODUCTS, [
    'id', 'categoryId', 'name', 'description', 'price', 'images', 'shopeeLink', 'createdAt'
  ]);
  createSheetIfMissing_(ss, SHEET_NAMES.FEED, [
    'id', 'type', 'mediaUrl', 'caption', 'description', 'tags', 'createdAt'
  ]);
  createSheetIfMissing_(ss, SHEET_NAMES.POSTS, [
    'id', 'title', 'excerpt', 'content', 'coverImage', 'createdAt'
  ]);
  createSheetIfMissing_(ss, SHEET_NAMES.SESSIONS, ['token', 'username', 'expiresAt']);

  const adminSheet = createSheetIfMissing_(ss, SHEET_NAMES.ADMIN, ['username', 'password']);
  // Nếu sheet cũ dùng cột 'passwordHash', đổi tên thành 'password'
  if (adminSheet.getLastRow() >= 1) {
    const header = adminSheet.getRange(1, 1, 1, 2).getValues()[0];
    if (header[1] === 'passwordHash') {
      adminSheet.getRange(1, 2).setValue('password');
    }
  }
  if (adminSheet.getLastRow() < 2) {
    adminSheet.appendRow([DEFAULT_ADMIN.username, DEFAULT_ADMIN.password]);
  }

  getOrCreateMediaFolder_();

  Logger.log('Setup hoàn tất. Tài khoản admin mặc định: ' + DEFAULT_ADMIN.username + ' / ' + DEFAULT_ADMIN.password);
  Logger.log('=> Hãy đổi mật khẩu ngay bằng cách chạy hàm changeAdminPassword("mat_khau_moi")');
}

/** Chạy thủ công trong trình soạn thảo để đổi mật khẩu admin. */
function changeAdminPassword(newPassword) {
  const sheet = getSheet_(SHEET_NAMES.ADMIN);
  sheet.getRange(2, 2).setValue(newPassword);
  Logger.log('Đã đổi mật khẩu thành công.');
}

/** Lấy thông tin admin hiện tại (username, password). */
function getAdmin() {
  const sheet = getSheet_(SHEET_NAMES.ADMIN);
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return { username: '', password: '' };
  return { username: String(rows[1][0] || ''), password: String(rows[1][1] || '') };
}

/** Cập nhật tên đăng nhập và/hoặc mật khẩu admin (yêu cầu đăng nhập). */
function updateAdmin(body) {
  requireAuth(body.token);
  const sheet = getSheet_(SHEET_NAMES.ADMIN);
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) throw new Error('Chưa có tài khoản admin');

  if (body.username !== undefined) {
    sheet.getRange(2, 1).setValue(String(body.username));
  }
  if (body.password !== undefined) {
    sheet.getRange(2, 2).setValue(String(body.password));
  }

  return { success: true };
}

// ============================= TIỆN ÍCH DÙNG CHUNG =============================

function getSheet_(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error('Thiếu sheet "' + name + '" — hãy chạy hàm setupProject() trước.');
  return sheet;
}

function createSheetIfMissing_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sheetToObjects_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  const rows = values.slice(1);
  return rows
    .filter((row) => row[0] !== '')
    .map((row) => {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = row[i]));
      return obj;
    });
}

function updateRowById_(sheetName, id, fields) {
  const sheet = getSheet_(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      Object.keys(fields).forEach((key) => {
        if (fields[key] === undefined) return;
        const col = headers.indexOf(key);
        if (col !== -1) sheet.getRange(i + 1, col + 1).setValue(fields[key]);
      });
      return;
    }
  }
  throw new Error('Không tìm thấy bản ghi để cập nhật (id: ' + id + ')');
}

function deleteRowById_(sheetName, id) {
  const sheet = getSheet_(sheetName);
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
  throw new Error('Không tìm thấy bản ghi để xoá (id: ' + id + ')');
}

// ============================= RESPONSE HELPERS =============================

function jsonOk(data) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonError(err) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: err.message || String(err) }))
    .setMimeType(ContentService.MimeType.JSON);
}
