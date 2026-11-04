import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Feed', end: true },
  { to: '/san-pham', label: 'Sản phẩm' },
  { to: '/bai-viet', label: 'Bài viết' },
  { to: '/gioi-thieu', label: 'Giới thiệu' }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <NavLink to="/" className="font-display text-2xl font-semibold tracking-tight">
          STYLIST<span className="text-coral">E</span>
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive ? 'text-coral' : 'text-ink/70 hover:text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/admin" className="btn-primary !py-2.5 !px-5 text-sm">
            Admin
          </NavLink>
        </nav>

        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Mở menu"
        >
          <span className={`h-0.5 w-6 bg-ink transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-6 bg-ink transition ${open ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-ink transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-paper px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-base font-semibold ${isActive ? 'text-coral' : 'text-ink/80'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <NavLink to="/admin" onClick={() => setOpen(false)} className="btn-primary text-sm">
              Admin
            </NavLink>
          </div>
        </div>
      )}
    </header>
  )
}
