import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import { api } from '../../api'

export default function Dashboard() {
  const [stats, setStats] = useState({ categories: 0, feed: 0, products: 0, posts: 0 })

  useEffect(() => {
    Promise.all([
      api.getCategories().catch(() => []),
      api.getFeed().catch(() => []),
      api.getProducts().catch(() => []),
      api.getPosts().catch(() => [])
    ]).then(([categories, feed, products, posts]) => {
      setStats({
        categories: categories.length,
        feed: feed.length,
        products: products.length,
        posts: posts.length
      })
    })
  }, [])

  const cards = [
    { label: 'Danh mục', value: stats.categories, to: '/admin/danh-muc' },
    { label: 'Feed ảnh & video', value: stats.feed, to: '/admin/feed' },
    { label: 'Sản phẩm', value: stats.products, to: '/admin/san-pham' },
    { label: 'Bài viết', value: stats.posts, to: '/admin/bai-viet' }
  ]

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-semibold">Tổng quan</h1>
      <p className="mt-2 text-paper/50">Quản lý toàn bộ nội dung trang Styliste của bạn.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-2xl border border-white/10 bg-[#1A1420] p-6 transition hover:border-coral"
          >
            <p className="text-3xl font-bold">{c.value}</p>
            <p className="mt-1 text-sm text-paper/50">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-[#1A1420] p-6">
        <p className="font-semibold">Gợi ý thứ tự làm việc</p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-paper/60">
          <li>Tạo danh mục sản phẩm (quần, áo, giày, dép...).</li>
          <li>Đăng ảnh/video vào Feed — đây là nội dung ưu tiên hiển thị đầu tiên.</li>
          <li>Thêm sản phẩm kèm 4–6 ảnh và liên kết Shopee.</li>
          <li>Viết thêm bài viết chia sẻ phong cách nếu cần.</li>
        </ol>
      </div>
    </AdminLayout>
  )
}
