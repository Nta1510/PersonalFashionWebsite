import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const firstImage = (product.images || '').split(',')[0]

  return (
    <Link
      to={`/san-pham/${product.id}`}
      className="group block overflow-hidden rounded-2xl border border-ink/10 bg-white transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-[4/5] overflow-hidden bg-ink/5">
        <img
          src={firstImage}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        {product.categoryName && (
          <p className="text-xs font-semibold uppercase tracking-wide text-coral">
            {product.categoryName}
          </p>
        )}
        <p className="mt-1 truncate font-display text-lg font-semibold">{product.name}</p>
        {product.price && (
          <p className="mt-1 text-sm font-semibold text-ink/70">
            {Number(product.price).toLocaleString('vi-VN')}₫
          </p>
        )}
      </div>
    </Link>
  )
}
