import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import MediaUploader from '../../components/MediaUploader'
import { api } from '../../api'

const empty = {
  id: '',
  categoryId: '',
  name: '',
  description: '',
  price: '',
  images: '',
  shopeeLink: ''
}

export default function ManageProducts() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function load() {
    api.getCategories().then(setCategories).catch(() => {})
    api.getProducts().then(setProducts).catch((e) => setError(e.message))
  }
  useEffect(load, [])

  const imageArr = form.images ? form.images.split(',').filter(Boolean) : []

  async function handleSubmit(e) {
    e.preventDefault()
    if (imageArr.length < 4) {
      setError('Vui lòng tải lên tối thiểu 4 ảnh sản phẩm (tối đa 6).')
      return
    }
    if (!form.categoryId) {
      setError('Vui lòng chọn danh mục.')
      return
    }
    setLoading(true)
    setError('')
    try {
      if (form.id) await api.updateProduct(form)
      else await api.addProduct(form)
      setForm(empty)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Xoá sản phẩm này?')) return
    await api.deleteProduct(id)
    load()
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-semibold">Sản phẩm</h1>
      <p className="mt-2 text-paper/50">
        Mỗi sản phẩm cần 4–6 ảnh và một liên kết Shopee để người xem mua trực tiếp.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5 rounded-2xl border border-white/10 bg-[#1A1420] p-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
              Danh mục
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper focus:border-coral focus:outline-none"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
              Tên sản phẩm
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper focus:border-coral focus:outline-none"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
              Giá (đ) — không bắt buộc
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper focus:border-coral focus:outline-none"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
              Liên kết Shopee
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper focus:border-coral focus:outline-none"
              placeholder="https://shopee.vn/..."
              value={form.shopeeLink}
              onChange={(e) => setForm({ ...form, shopeeLink: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
              Mô tả sản phẩm
            </label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper focus:border-coral focus:outline-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
            Hình ảnh sản phẩm (4–6 ảnh)
          </label>
          <div className="mt-1">
            <MediaUploader
              urls={imageArr}
              onChange={(arr) => setForm({ ...form, images: arr.join(',') })}
              max={6}
              accept="image/*"
            />
          </div>

          {error && <p className="mt-4 text-sm text-coral">{error}</p>}

          <div className="mt-6 flex gap-3">
            <button disabled={loading} className="btn-primary !bg-brand-gradient">
              {form.id ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
            </button>
            {form.id && (
              <button
                type="button"
                onClick={() => setForm(empty)}
                className="rounded-full px-5 py-3 text-sm font-semibold text-paper/50 hover:text-paper"
              >
                Huỷ
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#1A1420]">
            <div className="aspect-square bg-white/5">
              <img
                src={(p.images || '').split(',')[0]}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-medium">{p.name}</p>
              <p className="truncate text-xs text-paper/40">{p.categoryName}</p>
              <div className="mt-2 flex gap-3 text-xs">
                <button
                  onClick={() => setForm({ ...empty, ...p })}
                  className="text-paper/60 hover:text-coral"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-paper/60 hover:text-coral"
                >
                  Xoá
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
