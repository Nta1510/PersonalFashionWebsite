// src/api.js
// Giao tiếp với Google Apps Script Web App (backend).
// Đặt URL Web App (đuôi /exec) vào file .env => VITE_API_URL=...
//
// Ghi chú kỹ thuật quan trọng:
// - GAS không hỗ trợ CORS preflight (OPTIONS) đúng chuẩn, nên mọi request POST
//   phải gửi với Content-Type: text/plain để trình duyệt KHÔNG gửi preflight.
//   Backend (Code.gs) sẽ tự parse JSON từ text đó.
// - Các thao tác đọc công khai (danh mục, feed, sản phẩm, bài viết) dùng GET.
// - Các thao tác ghi (thêm/sửa/xoá, đăng nhập) dùng POST kèm token trong body.

const BASE_URL = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('styliste_admin_token') || '';
}

async function gasGet(action, params = {}) {
  const url = new URL(BASE_URL);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString(), { method: 'GET' });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Đã có lỗi xảy ra');
  return data.data;
}

async function gasPost(action, payload = {}) {
  const body = JSON.stringify({ action, token: getToken(), ...payload });
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Đã có lỗi xảy ra');
  return data.data;
}

export const api = {
  // --- Auth ---
  login: (username, password) => gasPost('login', { username, password }),
  logout: () => gasPost('logout', {}),
  getAdmin: () => gasGet('getAdmin'),
  updateAdmin: (payload) => gasPost('updateAdmin', payload),

  // --- Categories (Danh mục sản phẩm: quần, áo, giày, dép...) ---
  getCategories: () => gasGet('getCategories'),
  addCategory: (payload) => gasPost('addCategory', payload),
  updateCategory: (payload) => gasPost('updateCategory', payload),
  deleteCategory: (id) => gasPost('deleteCategory', { id }),

  // --- Feed: ảnh & video thời trang (ưu tiên #1) ---
  getFeed: (params) => gasGet('getFeed', params),
  getFeedItem: (id) => gasGet('getFeedItem', { id }),
  addFeedItem: (payload) => gasPost('addFeedItem', payload),
  updateFeedItem: (payload) => gasPost('updateFeedItem', payload),
  deleteFeedItem: (id) => gasPost('deleteFeedItem', { id }),

  // --- Sản phẩm (ưu tiên #2) ---
  getProducts: (params) => gasGet('getProducts', params),
  getProduct: (id) => gasGet('getProduct', { id }),
  addProduct: (payload) => gasPost('addProduct', payload),
  updateProduct: (payload) => gasPost('updateProduct', payload),
  deleteProduct: (id) => gasPost('deleteProduct', { id }),

  // --- Bài viết khác (ưu tiên #3) ---
  getPosts: (params) => gasGet('getPosts', params),
  getPost: (id) => gasGet('getPost', { id }),
  addPost: (payload) => gasPost('addPost', payload),
  updatePost: (payload) => gasPost('updatePost', payload),
  deletePost: (id) => gasPost('deletePost', { id }),

  // --- Upload ảnh/video lên Google Drive (trả về URL công khai) ---
  uploadMedia: (fileName, mimeType, base64Data) =>
    gasPost('uploadMedia', { fileName, mimeType, base64Data })
};

export function isLoggedIn() {
  return !!getToken();
}

export function saveToken(token) {
  localStorage.setItem('styliste_admin_token', token);
}

export function clearToken() {
  localStorage.removeItem('styliste_admin_token');
}
