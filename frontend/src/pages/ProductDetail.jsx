import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import Loading from '../components/Loading'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    api
      .getProduct(id)
      .then((p) => {
        setProduct(p)
        setActiveImg(0)
      })
      .catch((e) => setError(e.message))
  }, [id])

  if (error) return <p className="mx-auto max-w-5xl px-5 py-24 text-coral">{error}</p>
  if (!product) return <Loading />

  const images = (product.images || '').split(',').filter(Boolean)

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <Link to="/san-pham" className="text-sm font-semibold text-ink/50 hover:text-coral">
        ← Tất cả sản phẩm
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-ink/5">
            <img
              src={images[activeImg]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-6 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition ${
                    i === activeImg ? 'border-coral' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.categoryName && (
            <p className="text-sm font-semibold uppercase tracking-wide text-coral">
              {product.categoryName}
            </p>
          )}
          <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
            {product.name}
          </h1>
          {product.price && (
            <p className="mt-3 text-2xl font-bold">
              {Number(product.price).toLocaleString('vi-VN')}₫
            </p>
          )}
          {product.description && (
            <p className="mt-6 whitespace-pre-line text-ink/70">{product.description}</p>
          )}

          {product.shopeeLink && (
            <a
              href={product.shopeeLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="btn-primary mt-8 w-full !bg-[#EE4D2D] hover:!bg-[#D8431F] sm:w-auto"
            >
              Mua trên Shopee ↗
            </a>
          )}
          <p className="mt-3 text-xs text-ink/40">
            * Liên kết mua hàng có thể là liên kết tiếp thị (affiliate).
          </p>
        </div>
      </div>
    </div>
  )
}
