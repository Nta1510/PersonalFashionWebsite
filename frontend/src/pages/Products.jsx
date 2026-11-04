import { useEffect, useState } from 'react'
import { api } from '../api'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'

export default function Products() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState(null)
  const [activeCat, setActiveCat] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {})
    api
      .getProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
  }, [])

  const filtered =
    products && activeCat !== 'all'
      ? products.filter((p) => String(p.categoryId) === String(activeCat))
      : products

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-coral">Tuyển chọn</p>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Sản phẩm yêu thích</h1>
      <p className="mt-4 max-w-xl text-ink/60">
        Những món đồ đang được sử dụng thật, kèm liên kết mua trực tiếp trên Shopee.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCat('all')}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeCat === 'all' ? 'bg-ink text-paper' : 'bg-ink/5 text-ink/60 hover:text-ink'
          }`}
        >
          Tất cả
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              String(activeCat) === String(c.id)
                ? 'bg-ink text-paper'
                : 'bg-ink/5 text-ink/60 hover:text-ink'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {error && <p className="mt-8 text-coral">{error}</p>}
      {!products && !error && <Loading label="Đang tải sản phẩm..." />}

      {filtered && filtered.length === 0 && (
        <p className="py-16 text-center text-ink/50">Chưa có sản phẩm trong danh mục này.</p>
      )}

      {filtered && filtered.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
