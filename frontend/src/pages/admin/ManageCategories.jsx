import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { api } from '../../api'

const empty = { id: '', name: '' }

export default function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function load() {
    api.getCategories().then(setCategories).catch((e) => setError(e.message))
  }

  useEffect(load, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (form.id) {
        await api.updateCategory(form)
      } else {
        await api.addCategory(form)
      }
      setForm(empty)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Xoá danh mục này? Sản phẩm thuộc danh mục sẽ không bị xoá.')) return
    try {
      await api.deleteCategory(id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-semibold">Danh mục sản phẩm</h1>
      <p className="mt-2 text-paper/50">
        Ví dụ: Quần, Áo, Giày, Dép, Phụ kiện... Bạn có thể thêm bao nhiêu danh mục tuỳ ý.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
            Tên danh mục
          </label>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper focus:border-coral focus:outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <button disabled={loading} className="btn-primary !bg-brand-gradient">
          {form.id ? 'Cập nhật' : 'Thêm danh mục'}
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
      </form>

      {error && <p className="mt-4 text-coral">{error}</p>}

      <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#1A1420]">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-6 py-4">
            <p className="font-medium">{c.name}</p>
            <div className="flex gap-3 text-sm">
              <button
                onClick={() => setForm({ id: c.id, name: c.name })}
                className="text-paper/60 hover:text-coral"
              >
                Sửa
              </button>
              <button onClick={() => handleDelete(c.id)} className="text-paper/60 hover:text-coral">
                Xoá
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-paper/40">Chưa có danh mục nào.</p>
        )}
      </div>
    </AdminLayout>
  )
}
