<template>
  <header class="site-header" :class="[...headerClass, { 'is-scrolled': scrolled }]">
    <div class="site-header__inner">
      <NuxtLink to="/" class="site-header__brand">
        <span class="site-header__brand-mark">
          <img class="site-header__brand-img" src="/brand-icon.png" alt="" aria-hidden="true" />
        </span>
        <span class="site-header__brand-name">{{ t('brand.name') }}</span>
      </NuxtLink>

      <nav class="site-header__nav">
        <NuxtLink to="/" class="site-header__link">{{ t('nav.home') }}</NuxtLink>
        <NuxtLink to="/download" class="site-header__link">{{ t('nav.download') }}</NuxtLink>
        <ThemeToggle :tone="blend ? (theme === 'dark' ? 'dark' : 'light') : tone" />
        <LangSwitch :dark="blend ? theme === 'dark' : tone === 'dark'" />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** light 默认（白色磨砂） / dark（透明 + 白字，用于深色 hero 上） */
    tone?: 'light' | 'dark'
    /** 与 hero 背景融合，去掉底部分割线（首页用） */
    blend?: boolean
  }>(),
  { tone: 'light', blend: false }
)

const { t } = useI18n()
const { theme } = useTheme()

const headerClass = computed(() => {
  if (props.blend) {
    return [`site-header--blend`, `site-header--blend-${theme.value}`]
  }
  return [`site-header--${props.tone}`]
})

// blend 模式下 sticky 在 hero 上是透明的，一旦页面往下滚就会和后面的内容叠在一起；
// 监听滚动量给出 is-scrolled，让 header 滚动后自动浮出磨砂玻璃背景。
const scrolled = ref(false)

if (import.meta.client) {
  const onScroll = () => {
    scrolled.value = window.scrollY > 12
  }
  onMounted(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
  })
}
</script>

<style lang="scss" scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  transition: background 0.25s ease, border-color 0.25s ease,
    box-shadow 0.25s ease, backdrop-filter 0.25s ease;
}

.site-header__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.site-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 16px;
  color: inherit;
}

.site-header__brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 6px 14px -8px rgba(15, 23, 42, 0.22);
  padding: 2px;
  overflow: hidden;
}

:global(html[data-theme='dark']) .site-header__brand-mark {
  background: #ffffff;
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 6px 14px -8px rgba(0, 0, 0, 0.55);
}

.site-header__brand-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.site-header__nav {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.site-header__link {
  padding: 6px 12px;
  border-radius: 999px;
  color: inherit;
  opacity: 0.78;
  transition: opacity 0.18s ease, background 0.18s ease;

  &:hover {
    opacity: 1;
  }

  &.router-link-exact-active {
    opacity: 1;
    font-weight: 600;
  }
}

/* Light variant：默认 - 主题磨砂玻璃（浅/深主题自适配） */
.site-header--light {
  background: $overlay;
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  backdrop-filter: saturate(180%) blur(14px);
  border-bottom: 1px solid $border-subtle;
  color: $text-primary;

  .site-header__link.router-link-exact-active {
    color: $brand-primary;
    background: rgba(25, 137, 250, 0.12);
  }
}

/* Dark variant：透明，白色文字，用于深色 hero 顶部 */
.site-header--dark {
  background: transparent;
  color: #fff;

  .site-header__link.router-link-exact-active {
    background: rgba(255, 255, 255, 0.18);
  }
}

/* Blend：首页 hero 顶部，去掉分割线，背景与 hero 融为一体 */
.site-header--blend {
  background: transparent;
  border-bottom: 1px solid transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.site-header--blend-light {
  color: $text-primary;

  .site-header__link.router-link-exact-active {
    color: $brand-primary;
    background: rgba(25, 137, 250, 0.1);
  }
}

.site-header--blend-dark {
  color: #f1f5f9;

  .site-header__link.router-link-exact-active {
    background: rgba(255, 255, 255, 0.12);
  }
}

/* 滚动到 hero 以下时，blend 模式自动变成磨砂玻璃，避免文字与下方内容重叠 */
.site-header--blend.is-scrolled {
  background: $overlay;
  border-bottom-color: $border-subtle;
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  backdrop-filter: saturate(180%) blur(14px);
  box-shadow: 0 6px 20px -16px rgba(15, 23, 42, 0.25);
}

.site-header--blend-dark.is-scrolled {
  background: rgba(8, 14, 26, 0.72);
  border-bottom-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 6px 20px -16px rgba(0, 0, 0, 0.6);
}

@media (max-width: $breakpoint-mobile) {
  .site-header__inner {
    padding: 12px 16px;
    gap: 12px;
  }
  .site-header__nav {
    gap: 4px;
  }
  .site-header__link {
    padding: 6px 8px;
  }
  .site-header__brand-name {
    display: none;
  }
}
</style>
