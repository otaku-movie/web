<template>
  <div class="home-page">
    <SiteHeader blend />

    <section class="home-hero">
      <div class="home-hero__inner">
        <div class="home-hero__text">
          <span class="home-hero__chip">
            <span class="home-hero__chip-dot" />
            {{ t('home.heroChip') }}
          </span>
          <h1 class="home-hero__title" v-html="formattedTitle" />
          <p class="home-hero__desc">{{ t('home.heroDesc') }}</p>

          <div class="home-hero__cta">
            <NuxtLink class="mw-button home-hero__cta-primary" to="/download">
              <span>{{ t('home.ctaDownload') }}</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></svg>
            </NuxtLink>
            <a class="mw-button mw-button--ghost home-hero__cta-ghost" href="#features">
              {{ t('home.ctaShare') }}
            </a>
          </div>

          <dl class="home-hero__stats">
            <div>
              <dt>{{ t('home.stats.rating') }}</dt>
              <dd>
                <span class="home-hero__stats-strong">4.9</span>
                <span class="home-hero__stats-extra" aria-hidden>★★★★★</span>
              </dd>
            </div>
            <div>
              <dt>{{ t('home.stats.users') }}</dt>
              <dd><span class="home-hero__stats-strong">120K+</span></dd>
            </div>
            <div>
              <dt>{{ t('home.stats.cinemas') }}</dt>
              <dd><span class="home-hero__stats-strong">280+</span></dd>
            </div>
          </dl>
        </div>

        <div
          class="home-hero__visual"
          :class="`is-${direction}`"
          @mouseenter="paused = true"
          @mouseleave="paused = false"
        >
          <NuxtLink
            v-for="(item, idx) in highlights"
            :key="`front-${item.id}`"
            class="poster poster--front"
            :class="{ 'is-active': idx === activeIndex }"
            :to="`/share/movie/${item.id}`"
            :aria-label="displayTitle(item)"
            :aria-hidden="idx !== activeIndex"
            :tabindex="idx === activeIndex ? 0 : -1"
            :style="posterRatios[item.id] ? { '--poster-ratio': posterRatios[item.id] } : undefined"
          >
            <div class="poster__art poster__art--full">
              <AppImage
                :src="item.cover"
                :alt="displayTitle(item)"
                :label="t('brand.name')"
                loading="eager"
                @load="onPosterLoad(item.id, $event)"
              />
              <div class="poster__overlay">
                <span class="poster__title">{{ displayTitle(item) }}</span>
                <span v-if="formatSub(item)" class="poster__sub">{{ formatSub(item) }}</span>
              </div>
              <span v-if="item.rating != null" class="poster__rating">★ {{ item.rating.toFixed(1) }}</span>
            </div>
          </NuxtLink>
          <div v-if="!highlights.length" class="poster poster--front is-active is-skeleton">
            <div class="poster__art poster__art--full">
              <AppImage :label="t('brand.name')" />
            </div>
          </div>

          <button
            v-for="slot in deckSlots"
            :key="`deck-slot-${slot}`"
            type="button"
            class="poster poster--deck"
            :class="`poster--${slot === 0 ? 'mid' : 'back'}`"
            :aria-label="deckItems[slot] ? displayTitle(deckItems[slot]!) : ''"
            @click="goTo(activeIndex + slot + 1)"
          >
            <div class="poster__art">
              <AppImage
                v-for="item in highlights"
                :key="`deck-${slot}-${item.id}`"
                class="poster__art-layer"
                :class="{ 'is-active': deckItems[slot]?.id === item.id }"
                :src="item.cover"
                alt=""
                compact
                loading="eager"
              />
            </div>
          </button>

          <div v-if="total > 1" class="poster-controls">
            <button
              type="button"
              class="poster-controls__arrow"
              :aria-label="t('home.posterPrev')"
              @click="prev"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div class="poster-controls__dots" role="tablist">
              <button
                v-for="(_, i) in highlights"
                :key="`dot-${i}`"
                type="button"
                role="tab"
                :aria-selected="i === activeIndex"
                :aria-label="`${i + 1} / ${total}`"
                class="poster-controls__dot"
                :class="{ 'is-active': i === activeIndex }"
                @click="goTo(i)"
              />
            </div>
            <button
              type="button"
              class="poster-controls__arrow"
              :aria-label="t('home.posterNext')"
              @click="next"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="home-hero__bg-glow" aria-hidden />
    </section>

    <section id="features" class="home-features">
      <header class="home-features__head">
        <h2>{{ t('home.featuresTitle') }}</h2>
        <p>{{ t('home.featuresSubtitle') }}</p>
      </header>
      <div class="home-features__grid">
        <article
          v-for="(item, idx) in featureKeys"
          :key="item"
          class="feature-card"
          :class="`feature-card--${idx}`"
        >
          <span class="feature-card__icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <template v-if="item === 'ticket'">
                <path d="M2 9V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z" />
                <path d="M13 5v14" />
              </template>
              <template v-else-if="item === 'showtime'">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </template>
              <template v-else>
                <rect x="2" y="6" width="20" height="14" rx="3" />
                <path d="M2 11h20" />
                <path d="M15 16h3" />
              </template>
            </svg>
          </span>
          <h3>{{ t(`home.feature.${item}.title`) }}</h3>
          <p>{{ t(`home.feature.${item}.desc`) }}</p>
        </article>
      </div>
    </section>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import type { HomeHighlightItem } from '~/composables/useHomeHighlights'

const { t } = useI18n()

const featureKeys = ['ticket', 'showtime', 'wallet'] as const

// 把标题里的品牌名包成渐变 em（不存在则原样返回）
const formattedTitle = computed(() => {
  const raw = t('home.heroTitle')
  const brand = t('brand.name')
  return raw.includes(brand)
    ? raw.replace(brand, `<em class="home-hero__title-em">${brand}</em>`)
    : raw
})

const { data: highlights, fetchHighlights } = useHomeHighlights()

const activeIndex = ref(0)

/**
 * 记录每张海报加载完成后的真实宽高比，用 CSS 变量传给前景大卡的 aspect-ratio。
 * 这样卡片自动跟随海报真实比例，cover 模式下既能撑满卡片又不裁切，海报完整呈现。
 */
const posterRatios = reactive<Record<string, string>>({})
const onPosterLoad = (id: string | number, event: Event) => {
  const img = event.target as HTMLImageElement | null
  if (!img || !img.naturalWidth || !img.naturalHeight) return
  posterRatios[String(id)] = `${img.naturalWidth} / ${img.naturalHeight}`
}

watch(highlights, (list) => {
  if (activeIndex.value >= list.length) activeIndex.value = 0
})

const total = computed(() => highlights.value.length)

const deckItems = computed<(HomeHighlightItem | null)[]>(() => {
  if (total.value <= 1) return []
  const next = (activeIndex.value + 1) % total.value
  const last = (activeIndex.value + 2) % total.value
  if (total.value === 2) return [highlights.value[next] ?? null, null]
  return [highlights.value[next] ?? null, highlights.value[last] ?? null]
})

/** deck 槽位数量：2 部影片只显示 1 张后卡，3 部及以上显示 mid + back */
const deckSlots = computed(() => {
  if (total.value <= 1) return [] as number[]
  return total.value === 2 ? [0] : [0, 1]
})

// 切换方向，用于决定前景卡片是从右滑入（next）还是从左滑入（prev）
const direction = ref<'next' | 'prev'>('next')

const goTo = (i: number, dir?: 'next' | 'prev') => {
  if (!total.value) return
  const target = ((i % total.value) + total.value) % total.value
  if (target === activeIndex.value) return
  if (dir) {
    direction.value = dir
  } else {
    // 直接跳转（点 dot）时按最短环形距离推断方向
    const forward = (target - activeIndex.value + total.value) % total.value
    direction.value = forward <= total.value / 2 ? 'next' : 'prev'
  }
  activeIndex.value = target
}
const next = () => goTo(activeIndex.value + 1, 'next')
const prev = () => goTo(activeIndex.value - 1, 'prev')

// 自动轮播：5s 一次，hover 暂停
let timer: ReturnType<typeof setInterval> | null = null
const paused = ref(false)
const reduceMotion = ref(false)

const startAuto = () => {
  if (timer || total.value <= 1 || reduceMotion.value) return
  timer = setInterval(() => {
    if (!paused.value) next()
  }, 3000)
}
const stopAuto = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

let motionMedia: MediaQueryList | null = null
const syncMotionPreference = () => {
  reduceMotion.value = Boolean(motionMedia?.matches)
  stopAuto()
  if (!reduceMotion.value && total.value > 1) startAuto()
}

onMounted(() => {
  // 高亮电影不阻塞首屏 SSR：标题、说明和 CTA 先返回，轮播数据在客户端补齐。
  void fetchHighlights()

  if (typeof window !== 'undefined') {
    motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    syncMotionPreference()
    motionMedia.addEventListener('change', syncMotionPreference)
    return
  }
  startAuto()
})
onBeforeUnmount(() => {
  stopAuto()
  motionMedia?.removeEventListener('change', syncMotionPreference)
})
watch(total, (n) => {
  stopAuto()
  if (n > 1 && !reduceMotion.value) startAuto()
})

const formatSub = (item: HomeHighlightItem) => {
  const parts: string[] = []
  if (item.year) parts.push(item.year)
  if (item.duration) parts.push(`${item.duration} min`)
  return parts.join(' · ')
}

/** 优先展示像片名的标题，过滤纯数字等测试数据 */
const displayTitle = (item: HomeHighlightItem) => {
  const name = item.name?.trim() || ''
  const original = item.originalName?.trim() || ''
  const looksInvalid = (s: string) => !s || /^\d+$/.test(s) || s.length <= 2
  if (!looksInvalid(original) && looksInvalid(name)) return original
  if (!looksInvalid(name)) return name
  if (!looksInvalid(original)) return original
  return name || original
}

// 预加载所有 highlight 海报，避免切换时新挂载的 <img> 还没下载完就开始动画，
// 导致前景大卡只剩深色底色 + 文字 overlay 的视觉空窗。
watch(
  highlights,
  (list) => {
    if (typeof window === 'undefined') return
    list.forEach((item) => {
      const url = getImageUrl(item.cover)
      if (!url) return
      const img = new Image()
      img.decoding = 'async'
      img.src = url
    })
  },
  { immediate: true }
)

useSeoMeta({
  title: () => t('brand.name'),
  description: () => t('brand.tagline')
})
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: $surface-canvas;
  color: $text-primary;
}

/* ============ Hero ============ */
.home-hero {
  position: relative;
  overflow: hidden;
  padding: 88px 24px 96px;
  background: $hero-bg;
}

:global(html[data-theme='light']) .home-hero {
  background:
    radial-gradient(760px 460px at 84% 8%, rgba(139, 92, 246, 0.12), transparent 58%),
    radial-gradient(620px 360px at 10% 4%, rgba(25, 137, 250, 0.08), transparent 62%),
    linear-gradient(180deg, #ffffff 0%, #f8fbff 68%, #f3f6fb 100%);
}

:global(html[data-theme='dark']) .home-hero {
  /* bilibili 流派：完全 flat 纯灰底，让 chip/CTA/海报自己讲故事 */
  background: $surface-canvas;
}

.home-hero__inner {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: 56px;
  align-items: center;
}

.home-hero__text {
  min-width: 0;
}

.home-hero__chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background: $surface-card;
  border: 1px solid $border-emphasis;
  font-size: 13px;
  color: $text-secondary;
  font-weight: 500;
}

:global(html[data-theme='light']) .home-hero__chip,
:global(html[data-theme='light']) .home-hero__cta-ghost {
  box-shadow: 0 10px 28px -22px rgba(15, 23, 42, 0.35);
}

/* dark 下 chip 走 bilibili "未选中标签"风：半透明白底，无描边 */
:global(html[data-theme='dark']) .home-hero__chip {
  background: rgba(255, 255, 255, 0.06);
  border-color: transparent;
  color: $text-secondary;
}

/* ghost CTA 走 bilibili 同款半透明白：透明感更轻，比 Netflix 的不透明灰更通透 */
:global(html[data-theme='dark']) .home-hero__cta-ghost {
  background: rgba(255, 255, 255, 0.1);
  border-color: transparent;
  color: #ffffff;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    border-color: transparent;
  }
}

.home-hero__chip-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: $brand-primary;
  box-shadow: 0 0 0 4px rgba(25, 137, 250, 0.16);
}

.home-hero__title {
  margin: 22px 0 18px;
  font-size: 52px;
  line-height: 1.14;
  font-weight: 700;
  letter-spacing: -0.6px;
  color: $text-primary;
  max-width: 620px;

  :deep(.home-hero__title-em) {
    font-style: normal;
    background: linear-gradient(135deg, $brand-primary 0%, $accent-violet 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}

.home-hero__desc {
  margin: 0 0 32px;
  font-size: 17px;
  line-height: 1.7;
  color: $text-secondary;
  max-width: 520px;
}

.home-hero__cta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.home-hero__cta-primary {
  /* 用品牌渐变取代 surface-inverse，避免深色模式下变白底白字 */
  background: linear-gradient(135deg, $brand-primary 0%, $accent-violet 100%);
  color: #fff;
  box-shadow: 0 14px 30px -14px rgba(25, 137, 250, 0.55);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 20px 36px -16px rgba(25, 137, 250, 0.7);
  }

  svg {
    transition: transform 0.2s ease;
  }
  &:hover svg {
    transform: translateX(3px);
  }
}

.home-hero__cta-ghost {
  background: $surface-card;
  border: 1px solid $border-emphasis;
  color: $text-primary;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.02);

  &:hover {
    background: $surface-card-hover;
    border-color: rgba(25, 137, 250, 0.45);
  }
}

.home-hero__stats {
  margin: 40px 0 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px 24px;
  max-width: 480px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  dt {
    margin: 0;
    font-size: 12px;
    color: $text-tertiary;
    letter-spacing: 0.2px;
  }

  dd {
    margin: 0;
    display: flex;
    align-items: baseline;
    gap: 6px;
  }
}

.home-hero__stats-strong {
  font-size: 22px;
  font-weight: 700;
  color: $text-primary;
  letter-spacing: -0.2px;
}

.home-hero__stats-extra {
  font-size: 12px;
  color: $accent-warning;
  letter-spacing: -1px;
}

/* ============ Hero · 海报堆叠 ============ */
.home-hero__visual {
  position: relative;
  height: 480px;
  justify-self: end;
  width: 100%;
  max-width: 460px;
  margin-bottom: 56px; /* 给底部 controls 留位 */
}

.poster {
  position: absolute;
  border-radius: 12px;
  overflow: hidden;
  /* bilibili 视频卡用 12px 圆角；占位走中性灰，避免引入紫蓝色调 */
  background: #2a2b30;
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
  text-decoration: none;
  color: inherit;
}

:global(html[data-theme='dark']) .poster {
  background: $surface-card-hover;
}

.poster--deck {
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  appearance: none;
  outline: none;

  &:hover {
    transform: translateY(-3px) rotate(var(--deck-rot, 0deg));
    filter: brightness(1.05);
  }
}

.poster--mid { --deck-rot: -4deg; }
.poster--back { --deck-rot: -10deg; }

/* ===== 前景大卡：所有图片常驻，只切 active 状态，避免切换时重新挂载图片 ===== */
$swap-ease: cubic-bezier(0.22, 0.61, 0.36, 1); /* ease-out-quart：起手轻、落位稳 */
$swap-duration: 0.55s;

.poster--front {
  transition:
    opacity $swap-duration $swap-ease,
    transform $swap-duration $swap-ease,
    box-shadow 0.3s ease;
  will-change: transform, opacity;
  opacity: 0;
  pointer-events: none;
  transform: translateX(56px) translateY(8px) scale(0.94) rotate(2deg);
  z-index: 1;
}

.home-hero__visual.is-prev .poster--front {
  transform: translateX(-56px) translateY(8px) scale(0.94) rotate(-2deg);
}

.poster--front.is-active {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(0) translateY(0) scale(1) rotate(0);
  z-index: 2;
}

/* ===== deck 卡片：图片层常驻，仅淡入淡出 ===== */
.poster__art-layer {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.45s ease;
  pointer-events: none;

  &.is-active {
    opacity: 1;
    z-index: 1;
  }

  :deep(.app-image),
  :deep(.app-image__fallback) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* 切换控件 */
.poster-controls {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 4;
}

.poster-controls__arrow {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid $border-emphasis;
  background: $overlay-strong;
  color: $text-primary;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease,
    transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    border-color: rgba(25, 137, 250, 0.5);
    box-shadow: 0 4px 14px -8px rgba(15, 23, 42, 0.25);
    transform: translateY(-1px);
  }
}

.poster-controls__dots {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.poster-controls__dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: $border-default;
  cursor: pointer;
  transition: width 0.2s ease, background 0.2s ease, opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  &.is-active {
    width: 22px;
    background: linear-gradient(135deg, $brand-primary 0%, $accent-violet 100%);
  }
}

.poster--back {
  width: 200px;
  height: 300px;
  right: 220px;
  top: 90px;
  transform: rotate(-10deg);
  box-shadow: 0 20px 40px -18px rgba(8, 24, 70, 0.4);
  opacity: 0.92;
}

.poster--mid {
  width: 224px;
  height: 336px;
  right: 110px;
  top: 56px;
  transform: rotate(-4deg);
  box-shadow: 0 26px 48px -20px rgba(8, 24, 70, 0.45);
}

.poster--front {
  width: 288px;
  /* 默认 2:3；图片加载后由 --poster-ratio 覆盖，让卡片完美贴合真实海报比例 */
  aspect-ratio: var(--poster-ratio, 2 / 3);
  max-height: 460px;
  min-height: 360px;
  right: 0;
  top: 14px;
  padding: 0;
  background: transparent;
  box-shadow: $shadow-poster;
  border: none;
  z-index: 2;
  transition:
    opacity $swap-duration $swap-ease,
    transform $swap-duration $swap-ease,
    aspect-ratio $swap-duration $swap-ease,
    box-shadow 0.3s ease;
}

.poster--front.is-active:hover {
  transform: translateY(-4px);
  box-shadow: 0 50px 90px -32px rgba(8, 24, 70, 0.6);
}

.poster__art--full {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  aspect-ratio: auto;
}

.poster__overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  padding: 56px 16px 16px;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.72) 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 4px;
  pointer-events: none;
}

.poster__overlay .poster__title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.poster__overlay .poster__sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
}

.poster__art {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  isolation: isolate;
  background: #0b0f1f;
  aspect-ratio: 2 / 3;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}


.poster--mid .poster__art,
.poster--back .poster__art {
  width: 100%;
  height: 100%;
  border-radius: 0;
  aspect-ratio: auto;
}

.poster__rating {
  position: absolute;
  right: 12px;
  top: 12px;
  bottom: auto;
  z-index: 3;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  color: #ffd166;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.2px;
}


.poster.is-skeleton {
  pointer-events: none;
  cursor: default;
}

/* ============ Hero · 单点深紫光斑 ============ */
.home-hero__bg-glow {
  position: absolute;
  top: -120px;
  right: -120px;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(circle, $hero-glow 0%, transparent 70%);
  pointer-events: none;
}

/* ============ Features ============ */
.home-features {
  padding: 84px 24px 96px;
  background: $surface-canvas;
}

:global(html[data-theme='light']) .home-features {
  background: #f6f8fb;
}

:global(html[data-theme='dark']) .home-features {
  /* features 区比 hero 亮一档 + 顶部细分割线，与上面 hero 视觉分段 */
  background: #1c1d20;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

/* feature-card 在亮一档的 section 底上再亮一档，确保卡片明显浮出 */
:global(html[data-theme='dark']) .feature-card {
  background: $surface-card-hover;
  border-color: transparent;
  box-shadow: none;

  &:hover {
    background: #34353a;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    transform: translateY(-2px);
  }
}

.home-features__head {
  max-width: 1200px;
  margin: 0 auto 40px;
  text-align: center;

  h2 {
    margin: 0 0 8px;
    font-size: 30px;
    font-weight: 700;
    color: $text-primary;
    letter-spacing: -0.4px;
  }

  p {
    margin: 0;
    color: $text-tertiary;
    font-size: 15px;
  }
}

.home-features__grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.feature-card {
  background: $surface-card;
  border-radius: $radius-xl;
  padding: 32px 28px;
  border: 1px solid $border-subtle;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-card;
    border-color: transparent;
  }

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: $text-primary;
  }

  p {
    margin: 0;
    color: $text-secondary;
    line-height: 1.7;
    font-size: 14px;
  }
}

.feature-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $brand-primary 0%, $accent-violet 100%);
}

/* ============ 响应式 ============ */
@media (max-width: $breakpoint-tablet) {
  .home-hero__inner {
    grid-template-columns: 1fr;
    gap: 56px;
  }
  .home-hero__visual {
    justify-self: center;
    height: 440px;
    max-width: 420px;
  }
  .home-hero__title {
    font-size: 44px;
  }
  .home-features__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: $breakpoint-mobile) {
  .home-hero {
    padding: 88px 20px 64px;
  }
  .home-hero__title {
    font-size: 32px;
  }
  .home-hero__desc {
    font-size: 15px;
  }
  .home-hero__stats {
    margin-top: 28px;
    gap: 14px 18px;
  }
  .home-hero__stats-strong {
    font-size: 18px;
  }
  .home-hero__visual {
    height: 360px;
    max-width: 340px;
  }
  .poster--back { display: none; }
  .poster--mid {
    width: 180px;
    height: 260px;
    right: 140px;
    top: 60px;
  }
  .poster--front {
    width: 220px;
    /* 移动端同样跟随海报真实比例，避免 cover 裁切；上下限按移动端 hero 高度收紧 */
    height: auto;
    max-height: 340px;
    min-height: 280px;
    right: 0;
    top: 14px;
  }
  .home-features {
    padding: 56px 20px 64px;
  }
  .home-features__head h2 {
    font-size: 24px;
  }
  .home-features__grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
