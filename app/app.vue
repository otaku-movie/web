<template>
  <NuxtPage />
</template>

<script setup lang="ts">
const { theme } = useTheme()
const { locale } = useI18n()
const { public: pub } = useRuntimeConfig()

const siteUrl = computed(() => String(pub.siteUrl || '').replace(/\/+$/, ''))
const brandName = 'シネコ'
const ogImage = computed(() =>
  siteUrl.value ? `${siteUrl.value}/brand-icon.png` : '/brand-icon.png'
)

useHead({
  script: [
    {
      /* 在首屏尽早设置 data-theme 与 documentElement.style.colorScheme，
       * 避免主题闪烁（FOUC）以及 Chrome 的"Auto Dark Mode for Web Contents"
       * 在 CSS 解析前给整页叠一层强制 dark 滤镜。
       * 只读 mw_theme cookie，不再跟随系统 prefers-color-scheme，默认 light。 */
      innerHTML: `(function(){try{var t='light';var d=document.documentElement;d.setAttribute('data-theme',t);d.style.colorScheme=t;}catch(e){}})()`,
      tagPosition: 'head'
    }
  ],
  htmlAttrs: {
    lang: locale,
    'data-theme': theme
  },
  link: [
    { rel: 'manifest', href: '/manifest.webmanifest' }
  ]
})

/* color-scheme meta 已经在 nuxt.config.ts 的 app.head.meta 中静态声明，
 * 不在这里重复定义，避免 useHead 合并时产生重复或被覆写 */

useSeoMeta({
  ogSiteName: brandName,
  ogType: 'website',
  ogImage,
  twitterCard: 'summary_large_image',
  twitterImage: ogImage
})
</script>

<style lang="scss">
// 全局基础样式在 main.scss
</style>
