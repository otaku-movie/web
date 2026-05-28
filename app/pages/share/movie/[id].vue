<template>
  <div class="share-page">
    <div class="share-shell">
      <SiteHeader />

      <main class="share-main">
        <div v-if="loading" class="share-state">
          <div class="mw-spinner" />
        </div>

        <div v-else-if="error || !data" class="share-state">
          <p>{{ error ? t('common.loadFailed') : t('common.notFound') }}</p>
          <button v-if="error" class="mw-button mw-button--ghost" @click="fetchMovie">
            {{ t('common.retry') }}
          </button>
          <NuxtLink class="mw-button" to="/">{{ t('nav.home') }}</NuxtLink>
        </div>

        <article v-else class="share-card">
          <div class="share-card__poster">
            <AppImage
              :src="data.cover"
              :alt="data.name"
              :label="t('brand.name')"
              loading="eager"
            />
          </div>

          <div class="share-card__body">
            <h1 class="share-card__title">{{ data.name }}</h1>
            <p
              v-if="data.originalName && data.originalName !== data.name"
              class="share-card__original"
            >
              {{ data.originalName }}
            </p>

            <ul class="share-card__meta">
              <li v-if="data.rating !== null && data.rating !== undefined" class="share-card__meta-rating">
                <span class="share-card__meta-label">{{ t('share.movie.rating') }}</span>
                <span class="share-card__meta-value">
                  ★ {{ data.rating.toFixed(1) }}
                  <small v-if="data.ratingCount">({{ data.ratingCount }})</small>
                </span>
              </li>
              <li v-if="data.duration">
                <span class="share-card__meta-dot" aria-hidden>·</span>
                <span class="share-card__meta-value">{{ t('share.movie.duration', { minutes: data.duration }) }}</span>
              </li>
              <li v-if="data.startDate">
                <span class="share-card__meta-dot" aria-hidden>·</span>
                <span class="share-card__meta-value">{{ t('share.movie.releaseDate', { date: data.startDate }) }}</span>
              </li>
            </ul>

            <section v-if="data.tags && data.tags.length" class="share-card__section">
              <h2>{{ t('share.movie.genresTitle') }}</h2>
              <div class="share-card__tags">
                <span v-for="tag in data.tags" :key="tag" class="mw-tag">{{ tag }}</span>
              </div>
            </section>

            <section v-if="data.description" class="share-card__section">
              <h2>{{ t('share.movie.synopsisTitle') }}</h2>
              <p class="share-card__desc">{{ data.description }}</p>
            </section>

            <div class="share-card__cta">
              <a class="mw-button" :href="deepLink" @click="onOpenInApp">
                {{ t('share.movie.openInApp') }}
              </a>
              <NuxtLink class="mw-button mw-button--ghost" to="/download">
                {{ t('share.movie.downloadHint') }}
              </NuxtLink>
            </div>

          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const { public: pub } = useRuntimeConfig()

const movieId = computed(() => String(route.params.id))
const { data, loading, error, fetchMovie } = useShareMovie(movieId.value)

const deepLink = computed(() => {
  const scheme = pub.appScheme || 'otakumovie'
  return `${scheme}://movie/${movieId.value}`
})

const onOpenInApp = (event: MouseEvent) => {
  if (typeof window === 'undefined') return
  const fallback = window.setTimeout(() => {
    if (!document.hidden) window.location.href = '/download'
  }, 1500)
  window.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) window.clearTimeout(fallback)
    },
    { once: true }
  )
  void event
}

await fetchMovie()

useSeoMeta({
  title: () => (data.value ? `${data.value.name} | ${t('brand.name')}` : t('brand.name')),
  description: () => data.value?.description || t('brand.tagline'),
  ogTitle: () => data.value?.name || t('brand.name'),
  ogDescription: () => data.value?.description || t('brand.tagline'),
  ogImage: () => data.value?.cover || '',
  twitterCard: 'summary_large_image'
})
</script>

<style lang="scss" scoped>
.share-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: $surface-canvas;
}

.share-shell {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100vh;
}

.share-main {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 72px;
}

.share-state {
  background: $surface-card;
  border-radius: $radius-xl;
  padding: 64px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: $shadow-card;
  color: $text-secondary;
}

/* ===== 主卡片：左海报 + 右文字 ===== */
.share-card {
  display: grid;
  grid-template-columns: minmax(200px, 610px) minmax(0, 1fr);
  gap: 0;
  align-items: stretch;
  background: $surface-card;
  border: 1px solid $border-default;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 32px 80px -36px rgba(0, 0, 0, 0.55);
}

:global(html[data-theme='light']) .share-card {
  border-color: rgba(15, 23, 42, 0.08);
  box-shadow: 0 32px 80px -32px rgba(15, 23, 42, 0.22);
}

.share-card__poster {
  position: relative;
  align-self: stretch;
  min-height: 100%;
  overflow: hidden;
  background: #0b0f1f;

  :deep(.app-image),
  :deep(.app-image__fallback) {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 100%;
    object-fit: cover;
    object-position: center center;
  }
}

.share-card__body {
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.share-card__title {
  margin: 0;
  font-size: clamp(26px, 2.6vw, 36px);
  line-height: 1.18;
  font-weight: 700;
  color: $text-primary;
  letter-spacing: -0.4px;
}

.share-card__original {
  margin: 0;
  color: $text-tertiary;
  font-size: 14px;
}

.share-card__meta {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 14px;
  font-size: 14px;
  color: $text-secondary;

  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
}

.share-card__meta-label {
  color: $text-tertiary;
}

.share-card__meta-dot {
  color: $text-tertiary;
}

.share-card__meta-rating .share-card__meta-value {
  color: $accent-warning;
  font-weight: 700;

  small {
    color: $text-tertiary;
    font-weight: 400;
    margin-left: 2px;
  }
}

.share-card__section {
  display: flex;
  flex-direction: column;
  gap: 8px;

  h2 {
    margin: 0;
    font-size: 13px;
    color: $text-tertiary;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
}

.share-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.share-card__desc {
  margin: 0;
  color: $text-secondary;
  line-height: 1.8;
  font-size: 15px;
  white-space: pre-line;
}

.share-card__cta {
  margin-top: 8px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.share-card__footnote {
  margin: 4px 0 0;
  color: $text-tertiary;
  font-size: 12px;
}

/* ===== 响应式：≤960px 单列，海报变顶部封面 ===== */
@media (max-width: $breakpoint-tablet) {
  .share-main {
    padding: 20px 16px 56px;
  }
  .share-card {
    grid-template-columns: 1fr;
  }
  .share-card__poster {
    aspect-ratio: 27 / 40;
    max-height: 72vh;
  }
  .share-card__body {
    padding: 24px;
  }
}
</style>
