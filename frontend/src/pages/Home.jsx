import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import FeedCard from '../components/FeedCard'
import Loading from '../components/Loading'

export default function Home() {
  const [feed, setFeed] = useState(null)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getFeed()
      .then(setFeed)
      .catch((e) => setError(e.message))
  }, [])

  const filtered =
    feed && filter !== 'all' ? feed.filter((f) => f.type === filter) : feed

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-16 md:pb-20 md:pt-24">
          <p className="text-sm font-semibold uppercase tracking-wide text-coral">
            Nhật ký phong cách
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.05] md:text-7xl">
            Mặc những gì
            <br />
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              khiến bạn tự tin.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink/60">
            Ảnh, video và những món đồ được tuyển chọn mỗi ngày — cập nhật liên tục,
            không công thức, chỉ có gu.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#feed" className="btn-primary">
              Xem feed mới nhất
            </a>
            <Link to="/san-pham" className="btn-outline">
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-gradient opacity-20 blur-3xl md:h-96 md:w-96" />
      </section>

      {/* Feed */}
      <section id="feed" className="mx-auto max-w-6xl px-5 pb-24">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold">Feed mới nhất</h2>
          <div className="flex gap-2 rounded-full bg-ink/5 p-1">
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'image', label: 'Ảnh' },
              { key: 'video', label: 'Video' }
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  filter === t.key ? 'bg-ink text-paper' : 'text-ink/60 hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-coral">{error}</p>}
        {!feed && !error && <Loading label="Đang tải feed..." />}

        {filtered && filtered.length === 0 && (
          <p className="py-16 text-center text-ink/50">Chưa có nội dung nào ở đây.</p>
        )}

        {filtered && filtered.length > 0 && (
          <div className="feed-grid">
            {filtered.map((item) => (
              <FeedCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
