import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, saveToken, isLoggedIn } from '../../api'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isLoggedIn()) {
    navigate('/admin')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token } = await api.login(username, password)
      saveToken(token)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm rounded-3xl bg-[#1A1420] p-8 text-paper shadow-2xl">
        <p className="font-display text-2xl font-semibold">
          STYLIST<span className="text-coral">E</span>
        </p>
        <p className="mt-1 text-sm text-paper/50">Đăng nhập khu vực quản trị</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
              Tài khoản
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper placeholder:text-paper/30 focus:border-coral focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-paper/50">
              Mật khẩu
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper placeholder:text-paper/30 focus:border-coral focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-coral">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full !bg-brand-gradient">
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  )
}
