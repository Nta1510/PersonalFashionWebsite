import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import MediaUploader from '../../components/MediaUploader'
import { api } from '../../api'

const empty = { id: '', title: '', excerpt: '', content: '', coverImage: '' }

export default function ManageBlog() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function load() {
    api.getPosts().then(setPosts).catch((e) => setError(e.message))
  }
  useEffect(load, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (form.id) await api.updatePost(form)
      else await api.addPost(form)
      setForm(empty)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Xoá bài viết này?')) return
    await api.deletePost(id)
    load()
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-semibold">Bài viết</h1>
      <p className="mt-2 text-paper/50">Nội dung bổ sung — chia sẻ, hướng dẫn phối đồ, câu chuyện cá nhân.</p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5 rounded-2xl border border-white/10 bg-[#1A1420] p-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
              Tiêu đề
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper focus:border-coral focus:outline-none"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
              Tóm tắt ngắn
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper focus:border-coral focus:outline-none"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
              Nội dung
            </label>
            <textarea
              rows={8}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper focus:border-coral focus:outline-none"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
            Ảnh bìa
          </label>
          <div className="mt-1">
            <MediaUploader
              urls={form.coverImage ? [form.coverImage] : []}
              onChange={(arr) => setForm({ ...form, coverImage: arr[0] || '' })}
              max={1}
              accept="image/*"
            />
          </div>

          {error && <p className="mt-4 text-sm text-coral">{error}</p>}

          <div className="mt-6 flex gap-3">
            <button disabled={loading} className="btn-primary !bg-brand-gradient">
              {form.id ? 'Cập nhật' : 'Đăng bài viết'}
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

      <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#1A1420]">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center justify-between px-6 py-4">
            <p className="font-medium">{p.title}</p>
            <div className="flex gap-3 text-sm">
              <button onClick={() => setForm({ ...empty, ...p })} className="text-paper/60 hover:text-coral">
                Sửa
              </button>
              <button onClick={() => handleDelete(p.id)} className="text-paper/60 hover:text-coral">
                Xoá
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-paper/40">Chưa có bài viết nào.</p>
        )}
      </div>
    </AdminLayout>
  )
}
