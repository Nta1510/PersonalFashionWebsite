import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import MediaUploader from '../../components/MediaUploader'
import { api } from '../../api'

const empty = { id: '', type: 'image', mediaUrl: '', caption: '', description: '', tags: '' }

export default function ManageFeed() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function load() {
    api.getFeed().then(setItems).catch((e) => setError(e.message))
  }
  useEffect(load, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.mediaUrl) {
      setError('Vui lòng tải lên 1 ảnh hoặc video.')
      return
    }
    setLoading(true)
    setError('')
    try {
      if (form.id) await api.updateFeedItem(form)
      else await api.addFeedItem(form)
      setForm(empty)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Xoá bài đăng này?')) return
    await api.deleteFeedItem(id)
    load()
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-semibold">Feed ảnh &amp; video</h1>
      <p className="mt-2 text-paper/50">
        Nội dung ưu tiên hiển thị đầu tiên trên trang chủ — cập nhật thường xuyên để thu hút người xem.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5 rounded-2xl border border-white/10 bg-[#1A1420] p-6 lg:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
            Loại nội dung
          </label>
          <div className="mt-1 flex gap-2">
            {['image', 'video'].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm({ ...form, type: t, mediaUrl: '' })}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  form.type === t ? 'bg-brand-gradient' : 'bg-white/5 text-paper/60'
                }`}
              >
                {t === 'image' ? 'Ảnh' : 'Video'}
              </button>
            ))}
          </div>

          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-paper/50">
            Tệp {form.type === 'image' ? 'ảnh' : 'video'}
          </label>
          <div className="mt-1">
            <MediaUploader
              urls={form.mediaUrl ? [form.mediaUrl] : []}
              onChange={(arr) => setForm({ ...form, mediaUrl: arr[0] || '' })}
              max={1}
              accept={form.type === 'image' ? 'image/*' : 'video/*'}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
              Chú thích (caption)
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper focus:border-coral focus:outline-none"
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
              Mô tả chi tiết
            </label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper focus:border-coral focus:outline-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
              Hashtag (cách nhau bằng dấu phẩy)
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper focus:border-coral focus:outline-none"
              placeholder="ootd, streetstyle, mua-he"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>

          {error && <p className="text-sm text-coral">{error}</p>}

          <div className="flex gap-3">
            <button disabled={loading} className="btn-primary !bg-brand-gradient">
              {form.id ? 'Cập nhật' : 'Đăng bài'}
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
        {items.map((it) => (
          <div key={it.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#1A1420]">
            <div className="aspect-square bg-white/5">
              {it.type === 'video' ? (
                <video src={it.mediaUrl} className="h-full w-full object-cover" muted />
              ) : (
                <img src={it.mediaUrl} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-medium">{it.caption}</p>
              <div className="mt-2 flex gap-3 text-xs">
                <button onClick={() => setForm(it)} className="text-paper/60 hover:text-coral">
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(it.id)}
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
