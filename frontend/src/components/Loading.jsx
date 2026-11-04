export default function Loading({ label = 'Đang tải...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-ink/10 border-t-coral" />
      <p className="text-sm text-ink/50">{label}</p>
    </div>
  )
}
