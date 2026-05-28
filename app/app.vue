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
      innerHTML: `(function(){try{var m=document.cookie.match(/(?:^|; )mw_theme=(dark|light)(?:;|$)/);var t=m?m[1]:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`,
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
