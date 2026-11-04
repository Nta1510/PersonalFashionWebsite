import { useState } from 'react'
import { api } from '../api'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// urls: array of current URLs. onChange(newArray)
export default function MediaUploader({ urls = [], onChange, max = 6, accept = 'image/*' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    if (urls.length + files.length > max) {
      setError(`Chỉ được tối đa ${max} ảnh/video.`)
      return
    }
    setError('')
    setUploading(true)
    try {
      const newUrls = []
      for (const file of files) {
        const base64 = await fileToBase64(file)
        const { url } = await api.uploadMedia(file.name, file.type, base64)
        newUrls.push(url)
      }
      onChange([...urls, ...newUrls])
    } catch (err) {
      setError(err.message || 'Tải lên thất bại')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function removeAt(i) {
    onChange(urls.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {urls.map((url, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden rounded-xl bg-white/5">
            {accept.includes('video') ? (
              <video src={url} className="h-full w-full object-cover" muted />
            ) : (
              <img src={url} alt="" className="h-full w-full object-cover" />
            )}
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 rounded-full bg-ink/70 px-2 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
            >
              Xoá
            </button>
          </div>
        ))}
        {urls.length < max && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 text-xs text-paper/50 transition hover:border-coral hover:text-coral">
            {uploading ? 'Đang tải...' : '+ Thêm'}
            <input
              type="file"
              accept={accept}
              multiple
              className="hidden"
              onChange={handleFiles}
              disabled={uploading}
            />
          </label>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-coral">{error}</p>}
      <p className="mt-2 text-xs text-paper/40">{urls.length}/{max}</p>
    </div>
  )
}
