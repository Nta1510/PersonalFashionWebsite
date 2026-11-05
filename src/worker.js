export default {
  async fetch(request, env, ctx) {
    try {
      return await env.ASSETS.fetch(request)
    } catch (_) {
      const url = new URL(request.url)
      return await env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request))
    }
  }
}