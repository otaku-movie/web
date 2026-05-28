import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler((event) => {
  const { public: pub } = useRuntimeConfig()
  const name = 'シネコ'

  setHeader(event, 'content-type', 'application/manifest+json; charset=utf-8')

  return {
    name,
    short_name: name,
    description: 'ポケットに映画館を。上映情報、座席予約、チケット管理を一つに。',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1989fa',
    categories: ['entertainment', 'movies'],
    icons: [
      {
        src: '/brand-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
    related_applications: [
      ...(pub.appStoreUrl
        ? [{ platform: 'itunes', url: pub.appStoreUrl }]
        : []),
      ...(pub.googlePlayUrl
        ? [{ platform: 'play', url: pub.googlePlayUrl }]
        : [])
    ],
    prefer_related_applications: false
  }
})
