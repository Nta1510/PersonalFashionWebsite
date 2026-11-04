import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import Loading from '../components/Loading'

export default function BlogDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getPost(id)
      .then(setPost)
      .catch((e) => setError(e.message))
  }, [id])

  if (error) return <p className="mx-auto max-w-3xl px-5 py-24 text-coral">{error}</p>
  if (!post) return <Loading />

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <Link to="/bai-viet" className="text-sm font-semibold text-ink/50 hover:text-coral">
        ← Tất cả bài viết
      </Link>
      {post.coverImage && (
        <div className="mt-6 overflow-hidden rounded-3xl bg-ink/5">
          <img src={post.coverImage} alt={post.title} className="w-full" />
        </div>
      )}
      <h1 className="mt-8 font-display text-3xl font-semibold md:text-4xl">{post.title}</h1>
      <div className="prose prose-neutral mt-6 max-w-none whitespace-pre-line text-ink/75">
        {post.content}
      </div>
    </article>
  )
}
