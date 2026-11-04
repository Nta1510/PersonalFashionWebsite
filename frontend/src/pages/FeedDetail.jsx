import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import Loading from '../components/Loading'

export default function FeedDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getFeedItem(id)
      .then(setItem)
      .catch((e) => setError(e.message))
  }, [id])

  if (error) return <p className="mx-auto max-w-3xl px-5 py-24 text-coral">{error}</p>
  if (!item) return <Loading />

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <Link to="/" className="text-sm font-semibold text-ink/50 hover:text-coral">
        ← Quay lại feed
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl bg-ink/5">
        {item.type === 'video' ? (
          <video src={item.mediaUrl} controls className="w-full" />
        ) : (
          <img src={item.mediaUrl} alt={item.caption} className="w-full" />
        )}
      </div>

      <h1 className="mt-8 font-display text-3xl font-semibold">{item.caption}</h1>
      {item.description && (
        <p className="mt-4 whitespace-pre-line text-ink/70">{item.description}</p>
      )}
      {item.tags && (
        <div className="mt-5 flex flex-wrap gap-2">
          {String(item.tags)
            .split(',')
            .filter(Boolean)
            .map((t) => (
              <span
                key={t}
                className="rounded-full bg-ink/5 px-3 py-1 text-sm font-medium text-ink/60"
              >
                #{t.trim()}
              </span>
            ))}
        </div>
      )}
    </article>
  )
}
