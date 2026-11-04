import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Loading from '../components/Loading'

export default function Blog() {
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getPosts()
      .then(setPosts)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-coral">Câu chuyện</p>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Bài viết</h1>

      {error && <p className="mt-8 text-coral">{error}</p>}
      {!posts && !error && <Loading />}
      {posts && posts.length === 0 && (
        <p className="py-16 text-center text-ink/50">Chưa có bài viết nào.</p>
      )}

      <div className="mt-10 divide-y divide-ink/10">
        {posts &&
          posts.map((p) => (
            <Link
              key={p.id}
              to={`/bai-viet/${p.id}`}
              className="group flex flex-col gap-4 py-8 sm:flex-row sm:items-center"
            >
              {p.coverImage && (
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-2xl bg-ink/5 sm:w-48">
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div>
                <p className="font-display text-2xl font-semibold transition group-hover:text-coral">
                  {p.title}
                </p>
                {p.excerpt && <p className="mt-2 line-clamp-2 text-ink/60">{p.excerpt}</p>}
              </div>
            </Link>
          ))}
      </div>
    </div>
  )
}
