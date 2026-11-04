import { Link } from 'react-router-dom'

export default function FeedCard({ item }) {
  const isVideo = item.type === 'video'

  return (
    <Link
      to={`/feed/${item.id}`}
      className="group relative block overflow-hidden rounded-2xl bg-ink/5 shadow-sm transition hover:shadow-xl"
    >
      {isVideo ? (
        <video
          src={item.mediaUrl}
          className="w-full object-cover"
          muted
          playsInline
          preload="metadata"
        />
      ) : (
        <img
          src={item.mediaUrl}
          alt={item.caption}
          className="w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      )}

      {isVideo && (
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-paper backdrop-blur">
          ▶
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
        <p className="line-clamp-2 text-sm font-semibold text-white">{item.caption}</p>
        {item.tags && (
          <p className="mt-1 text-xs text-white/70">
            {String(item.tags)
              .split(',')
              .filter(Boolean)
              .map((t) => `#${t.trim()}`)
              .join(' ')}
          </p>
        )}
      </div>
    </Link>
  )
}
