import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { api } from '../../api'

export default function AdminSettings() {
  const [admin, setAdmin] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.getAdmin()
      .then((data) => setAdmin({ username: data.username || '', password: data.password || '' }))
      .catch(() => setAdmin({ username: '', password: '' }))
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setMessage('')
    setSaving(true)
    try {
      await api.updateAdmin({ username: admin.username, password: admin.password })
      setMessage('Đã cập nhật tài khoản admin vào Google Sheet.')
    } catch (err) {
      setMessage(err.message || 'Cập nhật thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-semibold">Cài đặt admin</h1>
      <p className="mt-2 text-paper/50">Thay đổi tên đăng nhập và mật khẩu khu vực quản trị.</p>

      <form onSubmit={handleSave} className="mt-8 max-w-md space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
            Tên đăng nhập
          </label>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper focus:border-coral focus:outline-none"
            value={admin.username}
            onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
            Mật khẩu
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper focus:border-coral focus:outline-none"
            value={admin.password}
            onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
            required
          />
        </div>

        {message && (
          <p className={`text-sm ${message.startsWith('Đã') ? 'text-emerald-400' : 'text-coral'}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full !bg-brand-gradient"
        >
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </form>

      <p className="mt-8 text-xs text-paper/40">
        Thông tin tài khoản được lưu trực tiếp vào sheet <b>Admin</b> của Google Sheet (dạng văn bản, không mã hóa).
      </p>
    </AdminLayout>
  )
}
