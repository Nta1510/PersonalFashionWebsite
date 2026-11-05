export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)

    // Let the React router handle direct navigation to client-side routes.
    if (
      response.status === 404 &&
      request.method === "GET" &&
      request.headers.get("accept")?.includes("text/html")
    ) {
      return env.ASSETS.fetch(new URL("/index.html", request.url))
    }

    return response
  }
}
