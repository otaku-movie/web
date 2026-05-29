// https://nuxt.com/docs/api/configuration/nuxt-config

// 仿照 Next.js 的行为：根据 NODE_ENV 自动加载 .env.development / .env.production。
// Nuxt 自身只会自动加载 `.env`，要用其他文件得显式 `--dotenv`。这里在 config 解析前手动补上，
// 避免直接用 `nuxi dev`（绕过 npm 脚本）启动时 runtimeConfig 取不到 NUXT_PUBLIC_* 的问题。
const envFile = `.env.${process.env.NODE_ENV || 'development'}`
try {
  // Node 20.6+ 内置的 dotenv 加载，无需引入额外依赖
  process.loadEnvFile(envFile)
} catch {
  // 文件不存在或 Node 版本过旧时静默跳过，保留默认值
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Cloudflare Pages 会自动注入 CF_PAGES；本地默认仍走 node-server。
  // 如需手动覆盖，可在构建环境设置 NITRO_PRESET。
  nitro: {
    preset: process.env.NITRO_PRESET || (process.env.CF_PAGES ? 'cloudflare-pages' : 'node-server')
  },

  modules: ['@nuxtjs/i18n'],

  css: ['~/assets/scss/main.scss'],

  vite: {
    /* marked 在 download/legal 页使用；预打包避免 dev 时 runtime 发现依赖触发整页重载后白屏/黑屏 */
    optimizeDeps: {
      include: ['marked']
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_variables.scss" as *;'
        }
      }
    }
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'ja',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      fallbackLocale: 'ja',
      alwaysRedirect: false
    },
    locales: [
      { code: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'ja', name: '日本語', file: 'ja.json' },
      { code: 'en-US', name: 'English', file: 'en-US.json' }
    ]
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080',
      imageBase: process.env.NUXT_PUBLIC_IMAGE_BASE || '',
      appStoreUrl: process.env.NUXT_PUBLIC_APP_STORE_URL || '',
      googlePlayUrl: process.env.NUXT_PUBLIC_GOOGLE_PLAY_URL || '',
      appScheme: process.env.NUXT_PUBLIC_APP_SCHEME || 'otakumovie',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || '',
      supportEmail: process.env.NUXT_PUBLIC_SUPPORT_EMAIL || ''
    }
  },

  app: {
    head: {
      title: 'シネコ',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#1989fa' },
        { name: 'color-scheme', content: 'dark light' }
      ],
      /* 关键路径 inline CSS：在 main.scss 还未到达前就把 html/body 背景定下来，
       * 避免 dev / 慢网络下首屏闪白或闪黑（FOUC）。
       * 数值与 _theme.scss 中 --mw-surface-canvas 保持一致。 */
      style: [
        {
          innerHTML:
            "html{background-color:#f7f8fa;color:#1f2937;color-scheme:light}html[data-theme='dark']{background-color:#17181a;color:#fff;color-scheme:dark}body,#__nuxt,[class$='-page']{margin:0;min-height:100vh;background-color:inherit;color:inherit}",
          tagPosition: 'head'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/brand-icon.png' },
        { rel: 'apple-touch-icon', href: '/brand-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        // 字体：拉丁文 Inter + 中日 Noto Sans SC/JP，用 fonts.bunny.net（Google Fonts 镜像，国内可达性更好）
        { rel: 'preconnect', href: 'https://fonts.bunny.net' },
        {
          rel: 'stylesheet',
          href:
            'https://fonts.bunny.net/css?family=' +
            [
              'inter:400,500,600,700',
              'noto-sans-sc:400,500,600,700',
              'noto-sans-jp:400,500,600,700'
            ].join('|') +
            '&display=swap'
        }
      ]
    }
  }
})
