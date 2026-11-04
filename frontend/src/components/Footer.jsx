export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-semibold">
              STYLIST<span className="text-coral">E</span>
            </p>
            <p className="mt-3 max-w-xs text-sm text-paper/60">
              Nhật ký phong cách cá nhân — nơi lưu lại những outfit, khoảnh khắc
              và món đồ đáng mặc mỗi ngày.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-paper/50">Khám phá</p>
            <ul className="mt-3 space-y-2 text-sm text-paper/70">
              <li>Feed ảnh &amp; video</li>
              <li>Sản phẩm gợi ý</li>
              <li>Bài viết phong cách</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-paper/50">Kết nối</p>
            <ul className="mt-3 space-y-2 text-sm text-paper/70">
              <li>Instagram</li>
              <li>TikTok</li>
              <li>Email hợp tác</li>
            </ul>
          </div>
        </div>
        <p className="mt-12 text-xs text-paper/40">
          © {new Date().getFullYear()} Styliste. Một số liên kết sản phẩm là liên kết tiếp thị (affiliate).
        </p>
      </div>
    </footer>
  )
}
