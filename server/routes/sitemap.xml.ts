import { defineEventHandler, getRequestURL, setHeader } from 'h3'

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '')

export default defineEventHandler((event) => {
  const { public: pub } = useRuntimeConfig()
  const requestUrl = getRequestURL(event)
  const siteUrl = stripTrailingSlash(String(pub.siteUrl || requestUrl.origin))
  const now = new Date().toISOString()

  const routes = [
    { loc: '/', priority: '1.0' },
    { loc: '/download', priority: '0.9' },
    { loc: '/legal/terms', priority: '0.5' },
    { loc: '/legal/privacy', priority: '0.5' },
    { loc: '/legal/third-party-sdk', priority: '0.4' }
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return body
})
