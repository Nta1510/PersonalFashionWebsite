import { NavLink, useNavigate } from 'react-router-dom'
import { api, clearToken } from '../api'

const items = [
  { to: '/admin', label: 'Tổng quan', end: true },
  { to: '/admin/danh-muc', label: 'Danh mục' },
  { to: '/admin/feed', label: 'Feed ảnh & video' },
  { to: '/admin/san-pham', label: 'Sản phẩm' },
  { to: '/admin/bai-viet', label: 'Bài viết' },
  { to: '/admin/cai-dat', label: 'Cài đặt admin' }
]

export default function AdminLayout({ children }) {
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await api.logout()
    } catch (e) {
      // ignore
    }
    clearToken()
    navigate('/admin/login')
  }

  return (
    <div className="admin-shell flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#1A1420] p-6 md:flex">
        <p className="font-display text-xl font-semibold">
          STYLIST<span className="text-coral">E</span>
          <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs font-normal">admin</span>
        </p>
        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-brand-gradient text-white' : 'text-paper/70 hover:bg-white/5'
                }`
              }
            >
              {it.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-6 rounded-xl border border-white/10 px-4 py-3 text-left text-sm font-medium text-paper/60 transition hover:border-coral hover:text-coral"
        >
          Đăng xuất
        </button>
      </aside>

      <main className="flex-1 p-5 md:p-10">{children}</main>
    </div>
  )
}
