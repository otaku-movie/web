<template>
  <div class="download-page">
    <SiteHeader blend />

    <section class="dl-hero">
      <div class="dl-hero__inner">
        <div class="dl-hero__text">
          <span class="dl-hero__chip">
            <span class="dl-hero__chip-dot" />
            {{ t('home.heroChip') }}
          </span>
          <h1 class="dl-hero__title" v-html="formattedTitle" />
          <p class="dl-hero__desc">{{ t('download.subtitle') }}</p>

          <div class="dl-hero__platforms" aria-hidden>
            <span
              v-for="key in platformKeys"
              :key="key"
              class="dl-hero__platform"
              :class="{ 'is-current': detected === key }"
            >
              <span class="dl-hero__platform-logo" :class="`is-${key}`">
                <svg v-if="key === 'android'" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3.6 20.4q.05-3.3 1.85-6.05Q7.25 11.6 10.3 10.05L8.55 7q-.15-.2-.075-.4Q8.55 6.4 8.75 6.3q.2-.1.4-.025.2.075.3.275l1.75 3q1.3-.55 2.8-.55t2.8.55l1.75-3q.1-.2.3-.275.2-.075.4.025.2.1.275.3.075.2-.075.4L17.7 10.05q3.05 1.55 4.85 4.3 1.8 2.75 1.85 6.05ZM8 17q.425 0 .713-.288Q9 16.425 9 16t-.287-.712Q8.425 15 8 15t-.713.288Q7 15.575 7 16t.287.712Q7.575 17 8 17Zm8 0q.425 0 .713-.288Q17 16.425 17 16t-.287-.712Q16.425 15 16 15t-.713.288Q15 15.575 15 16t.287.712Q15.575 17 16 17Z" /></svg>
                <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.07 12.45c-.02-2.13 1.74-3.16 1.82-3.21-1-1.45-2.54-1.65-3.09-1.67-1.32-.13-2.57.77-3.24.77-.67 0-1.7-.75-2.79-.73-1.43.02-2.76.83-3.5 2.11-1.49 2.59-.38 6.41 1.07 8.51.71 1.03 1.55 2.18 2.64 2.14 1.06-.04 1.46-.69 2.74-.69 1.28 0 1.64.69 2.76.67 1.14-.02 1.86-1.04 2.55-2.07.8-1.19 1.13-2.34 1.14-2.4-.03-.01-2.18-.84-2.2-3.33ZM14.93 6.13c.58-.71.98-1.7.87-2.69-.84.03-1.86.56-2.46 1.26-.54.62-1.01 1.62-.88 2.59.95.07 1.91-.48 2.47-1.16Z" /></svg>
              </span>
              <span class="dl-hero__platform-text">
                <span class="dl-hero__platform-label">{{ t(`download.platform.${key}`) }}</span>
                <span v-if="versionOf(key)" class="dl-hero__platform-meta">v{{ versionOf(key) }}</span>
              </span>
            </span>
          </div>
        </div>

        <div class="dl-hero__visual" aria-hidden>
          <div class="dl-mock">
            <div class="dl-mock__notch" />
            <div class="dl-mock__screen">
              <div class="dl-mock__statusbar">
                <span class="dl-mock__statusbar-time">9:41</span>
                <span class="dl-mock__statusbar-dots">
                  <i /><i /><i />
                </span>
              </div>
              <div class="dl-mock__brand">
                <span class="dl-mock__brand-mark">
                  <img class="dl-mock__brand-img" src="/brand-icon.png" alt="" aria-hidden="true" />
                </span>
                <span class="dl-mock__brand-name">{{ t('brand.name') }}</span>
              </div>

              <div class="dl-mock__poster">
                <span class="dl-mock__poster-tag">★ 4.9</span>
                <div class="dl-mock__poster-overlay">
                  <span class="dl-mock__poster-title" />
                  <span class="dl-mock__poster-sub" />
                </div>
              </div>

              <div class="dl-mock__list">
                <div v-for="i in 3" :key="i" class="dl-mock__row">
                  <span class="dl-mock__row-thumb" />
                  <span class="dl-mock__row-body">
                    <span class="dl-mock__row-l1" />
                    <span class="dl-mock__row-l2" />
                  </span>
                  <span class="dl-mock__row-cta" />
                </div>
              </div>
            </div>
            <div class="dl-mock__home" />
          </div>

          <div class="dl-mock__halo dl-mock__halo--a" />
          <div class="dl-mock__halo dl-mock__halo--b" />
        </div>
      </div>

      <div class="dl-hero__bg-glow" aria-hidden />
    </section>

    <section id="download-cards" class="dl-section">
      <div class="dl-section__inner">
        <header class="dl-section__head">
          <h2>{{ t('download.title') }}</h2>
          <p>{{ t('download.subtitle') }}</p>
        </header>

        <div v-if="loading" class="dl-state">
          <div class="mw-spinner" />
        </div>
        <div v-else-if="error" class="dl-state">
          <p>{{ t('common.loadFailed') }}</p>
          <button class="mw-button mw-button--ghost" @click="fetchLatest">
            {{ t('common.retry') }}
          </button>
        </div>
        <template v-else>
          <div class="dl-cards">
            <PlatformCard
              platform="android"
              :item="data?.android"
              :active="active === 'android'"
              :current-device="detected === 'android'"
              @activate="active = $event"
            >
              <template #logo>
                <img class="platform-card__logo-img" src="/brand-icon.png" alt="" aria-hidden="true" />
              </template>
            </PlatformCard>

            <PlatformCard
              platform="ios"
              :item="data?.ios"
              :active="active === 'ios'"
              :current-device="detected === 'ios'"
              @activate="active = $event"
            >
              <template #logo>
                <img class="platform-card__logo-img" src="/brand-icon.png" alt="" aria-hidden="true" />
              </template>
            </PlatformCard>
          </div>
        </template>
      </div>
    </section>

    <section v-if="!loading && !error" class="dl-notes-section">
      <div class="dl-notes-section__inner">
        <article class="dl-notes">
          <header class="dl-notes__head">
            <h2>{{ t('download.releaseNotes') }}</h2>
            <span class="dl-notes__pill">
              <span class="dl-notes__pill-dot" />
              {{ t(`download.platform.${active}`) }}
              <template v-if="activeItem?.versionName"> · v{{ activeItem.versionName }}</template>
            </span>
          </header>
          <div v-if="releaseHtml" class="dl-notes__body" v-html="releaseHtml" />
          <p v-else class="dl-notes__empty">{{ t('download.noReleaseNotes') }}</p>
        </article>
      </div>
    </section>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'

const { t } = useI18n()
const { data, loading, error, fetchLatest } = useLatestVersion()
const active = ref<'android' | 'ios'>('android')
const detected = ref<'android' | 'ios' | 'other'>('other')

const platformKeys = ['android', 'ios'] as const

const activeItem = computed(() =>
  active.value === 'ios' ? data.value?.ios : data.value?.android
)

const versionOf = (key: 'android' | 'ios') =>
  (key === 'ios' ? data.value?.ios?.versionName : data.value?.android?.versionName) || ''

// 把标题中的品牌名包成渐变 em，与首页同款效果
const formattedTitle = computed(() => {
  const raw = t('download.title')
  const brand = t('brand.name')
  return raw.includes(brand)
    ? raw.replace(brand, `<em class="dl-hero__title-em">${brand}</em>`)
    : raw
})

const releaseHtml = computed(() => {
  const note = activeItem.value?.releaseNote
  if (!note) return ''
  try {
    return marked.parse(note) as string
  } catch {
    return note
  }
})

onMounted(async () => {
  detected.value = detectOs()
  if (detected.value === 'ios' || detected.value === 'android') {
    active.value = detected.value
  }
  await fetchLatest()
})

useSeoMeta({
  title: () => `${t('download.title')} | ${t('brand.name')}`,
  description: () => t('download.subtitle')
})
</script>

<style lang="scss" scoped>
.download-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: $surface-canvas;
  color: $text-primary;
}

/* ============ Hero（与首页同款柔光底） ============ */
.dl-hero {
  position: relative;
  overflow: hidden;
  padding: 88px 24px 96px;
  background: $hero-bg;
}

:global(html[data-theme='light']) .dl-hero {
  background:
    radial-gradient(760px 460px at 84% 8%, rgba(139, 92, 246, 0.12), transparent 58%),
    radial-gradient(620px 360px at 10% 4%, rgba(25, 137, 250, 0.08), transparent 62%),
    linear-gradient(180deg, #ffffff 0%, #f8fbff 68%, #f3f6fb 100%);
}

:global(html[data-theme='dark']) .dl-hero {
  /* bilibili 同款 flat 灰底 */
  background: $surface-canvas;
}

.dl-hero__inner {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: 56px;
  align-items: center;
}

.dl-hero__text {
  min-width: 0;
}

.dl-hero__chip {
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

:global(html[data-theme='light']) .dl-hero__chip {
  box-shadow: 0 10px 28px -22px rgba(15, 23, 42, 0.35);
}

/* dark 下 chip 走 bilibili 同款半透明白：极轻，无描边 */
:global(html[data-theme='dark']) .dl-hero__chip {
  background: rgba(255, 255, 255, 0.06);
  border-color: transparent;
  color: $text-secondary;
}

.dl-hero__chip-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: $brand-primary;
  box-shadow: 0 0 0 4px rgba(25, 137, 250, 0.16);
}

.dl-hero__title {
  margin: 22px 0 18px;
  font-size: 52px;
  line-height: 1.14;
  font-weight: 700;
  letter-spacing: -0.6px;
  color: $text-primary;
  max-width: 620px;

  :deep(.dl-hero__title-em) {
    font-style: normal;
    background: linear-gradient(135deg, $brand-primary 0%, $accent-violet 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}

.dl-hero__desc {
  margin: 0 0 32px;
  font-size: 17px;
  line-height: 1.7;
  color: $text-secondary;
  max-width: 520px;
}

.dl-hero__platforms {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.dl-hero__platform {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 8px 8px;
  border-radius: 999px;
  background: $surface-card;
  border: 1px solid $border-emphasis;
  color: $text-primary;
  font-size: 13px;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  &.is-current {
    border-color: rgba(25, 137, 250, 0.5);
    box-shadow: 0 12px 28px -18px rgba(25, 137, 250, 0.55);
  }
}

:global(html[data-theme='light']) .dl-hero__platform {
  box-shadow: 0 10px 28px -22px rgba(15, 23, 42, 0.35);
}

/* dark 下平台 pill 走 bilibili 标签风：半透明白 + is-current 用品牌色填充（参考 b 站"已关注"高亮） */
:global(html[data-theme='dark']) .dl-hero__platform {
  background: rgba(255, 255, 255, 0.06);
  border-color: transparent;
  color: $text-primary;

  &.is-current {
    background: rgba(25, 137, 250, 0.2);
    border-color: rgba(25, 137, 250, 0.6);
    box-shadow: none;
  }
}

.dl-hero__platform-logo {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;

  &.is-android {
    background: linear-gradient(135deg, #3ddc84 0%, #2bb673 100%);
  }
  &.is-ios {
    background: $surface-inverse;
    color: $surface-card;
  }
}

.dl-hero__platform-text {
  display: inline-flex;
  flex-direction: column;
  line-height: 1.15;
  gap: 2px;
}

.dl-hero__platform-label {
  font-size: 13px;
  font-weight: 600;
}

.dl-hero__platform-meta {
  font-size: 11px;
  color: $text-tertiary;
  letter-spacing: 0.2px;
}

/* ============ Hero · 手机视觉 ============ */
.dl-hero__visual {
  position: relative;
  justify-self: end;
  width: 100%;
  max-width: 380px;
  height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dl-mock {
  position: relative;
  width: 268px;
  height: 520px;
  border-radius: 42px;
  padding: 10px;
  /* dark 默认金属灰；light 在下方覆写，避免 CSS 变量写在 gradient 里引发 dev 样式异常 */
  background: linear-gradient(160deg, #2a2b30 0%, #202126 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: $shadow-poster;
  z-index: 2;
}

:global(html[data-theme='light']) .dl-mock {
  background: linear-gradient(160deg, #ffffff 0%, #f1f5ff 100%);
  border-color: rgba(15, 23, 42, 0.06);
}

.dl-mock__notch {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 96px;
  height: 22px;
  border-radius: 999px;
  background: rgba(8, 14, 26, 0.92);
  z-index: 3;
}

.dl-mock__home {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 110px;
  height: 4px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.28);
}

:global(html[data-theme='dark']) .dl-mock__home {
  background: rgba(255, 255, 255, 0.3);
}

.dl-mock__screen {
  width: 100%;
  height: 100%;
  border-radius: 32px;
  background: linear-gradient(180deg, #ffffff 0%, #eef4ff 100%);
  padding: 28px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
  position: relative;
}

:global(html[data-theme='dark']) .dl-mock__screen {
  /* 屏幕内层走与 canvas 同色，让海报缩略图自身的颜色突出 */
  background: $surface-canvas;
}

.dl-mock__statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  color: $text-secondary;
  padding: 2px 4px 0;
}

.dl-mock__statusbar-time {
  font-weight: 600;
}

.dl-mock__statusbar-dots {
  display: inline-flex;
  gap: 3px;

  i {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: $text-tertiary;
  }
}

.dl-mock__brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.dl-mock__brand-mark {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 6px 14px -8px rgba(15, 23, 42, 0.25);
  padding: 2px;
  overflow: hidden;
}

.dl-mock__brand-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.dl-mock__brand-name {
  font-size: 12px;
  font-weight: 700;
  color: $text-primary;
  letter-spacing: -0.2px;
}

.dl-mock__poster {
  position: relative;
  height: 148px;
  border-radius: 14px;
  overflow: hidden;
  background:
    radial-gradient(120% 80% at 20% 0%, rgba(139, 92, 246, 0.55) 0%, transparent 60%),
    radial-gradient(140% 100% at 100% 100%, rgba(56, 189, 248, 0.5) 0%, transparent 60%),
    linear-gradient(135deg, #1f2540 0%, #4f3bff 60%, #1989fa 100%);
  box-shadow: 0 18px 40px -16px rgba(25, 137, 250, 0.55);
}

.dl-mock__poster-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.5);
  color: #ffd166;
  font-size: 10px;
  font-weight: 700;
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}

.dl-mock__poster-overlay {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dl-mock__poster-title {
  height: 10px;
  width: 68%;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.92);
}

.dl-mock__poster-sub {
  height: 6px;
  width: 38%;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.55);
}

.dl-mock__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.dl-mock__row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 12px;
  background: $surface-card;
  border: 1px solid $border-subtle;
}

:global(html[data-theme='dark']) .dl-mock__row {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.06);
}

.dl-mock__row-thumb {
  width: 28px;
  height: 36px;
  border-radius: 6px;
  background: linear-gradient(135deg, $brand-primary 0%, $accent-violet 100%);
  flex-shrink: 0;
}

.dl-mock__row-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.dl-mock__row-l1 {
  height: 6px;
  width: 70%;
  border-radius: 3px;
  background: $text-primary;
  opacity: 0.78;
}

.dl-mock__row-l2 {
  height: 5px;
  width: 40%;
  border-radius: 3px;
  background: $text-tertiary;
  opacity: 0.7;
}

.dl-mock__row-cta {
  width: 36px;
  height: 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, $brand-primary 0%, $accent-violet 100%);
  flex-shrink: 0;
}

/* phone 周边光晕：light 下作装饰，dark 下大幅减弱避免"雾化"整张图 */
.dl-mock__halo {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  filter: blur(40px);
  opacity: 0.6;

  &--a {
    width: 240px;
    height: 240px;
    top: -40px;
    right: -40px;
    background: radial-gradient(circle, $accent-violet 0%, transparent 60%);
  }
  &--b {
    width: 220px;
    height: 220px;
    bottom: -40px;
    left: -40px;
    background: radial-gradient(circle, $brand-primary 0%, transparent 60%);
    opacity: 0.5;
  }
}

/* dark 下完全去掉手机周边的紫/蓝光晕，避免给已经偏暗的整页"加雾" */
:global(html[data-theme='dark']) .dl-mock__halo {
  display: none;
}

/* Hero 整体右上角光斑（与首页一致） */
.dl-hero__bg-glow {
  position: absolute;
  top: -120px;
  right: -120px;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(circle, $hero-glow 0%, transparent 70%);
  pointer-events: none;
}

/* ============ 平台卡片 Section ============ */
.dl-section {
  background: $surface-canvas;
  padding: 72px 24px 32px;
}

:global(html[data-theme='light']) .dl-section {
  background: #f6f8fb;
}

:global(html[data-theme='dark']) .dl-section {
  /* 与上面 hero 视觉分段：亮一档 + 顶部细分割线 */
  background: #1c1d20;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.dl-section__inner {
  max-width: 1120px;
  margin: 0 auto;
}

.dl-section__head {
  text-align: center;
  margin-bottom: 36px;

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

.dl-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.dl-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 240px;
  background: $surface-card;
  border-radius: $radius-xl;
  box-shadow: $shadow-card;
  color: $text-secondary;
}

/* ============ 更新日志 Section ============ */
.dl-notes-section {
  background: $surface-canvas;
  padding: 32px 24px 96px;
}

:global(html[data-theme='light']) .dl-notes-section {
  background: #f6f8fb;
}

:global(html[data-theme='dark']) .dl-notes-section {
  background: $surface-canvas;
}

.dl-notes-section__inner {
  max-width: 1120px;
  margin: 0 auto;
}

.dl-notes {
  background: $surface-card;
  border-radius: $radius-xl;
  padding: 32px 36px;
  border: 1px solid $border-subtle;
  box-shadow: $shadow-card;
}

.dl-notes__head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  h2 {
    margin: 0;
    font-size: 20px;
    color: $text-primary;
    line-height: 1.2;
    letter-spacing: -0.2px;
  }
}

.dl-notes__pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(25, 137, 250, 0.1);
  color: $brand-primary;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.dl-notes__pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: $brand-primary;
  box-shadow: 0 0 0 4px rgba(25, 137, 250, 0.16);
}

.dl-notes__empty {
  color: $text-tertiary;
  margin: 0;
}

.dl-notes__body {
  color: $text-secondary;
  font-size: 15px;
  line-height: 1.8;

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4) {
    margin: 18px 0 8px;
    color: $text-primary;
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 20px;
  }

  :deep(li) {
    margin: 4px 0;
  }

  :deep(code) {
    background: var(--mw-code-bg);
    padding: 2px 6px;
    border-radius: 6px;
    font-size: 13px;
  }

  :deep(blockquote) {
    margin: 12px 0;
    padding: 8px 16px;
    background: var(--mw-blockquote-bg);
    border-left: 3px solid $brand-primary;
    border-radius: 0 8px 8px 0;
    color: $text-primary;
  }

  :deep(a) {
    color: $brand-primary;
  }
}

/* ============ 响应式 ============ */
@media (max-width: $breakpoint-tablet) {
  .dl-hero__inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .dl-hero__visual {
    justify-self: center;
    height: 480px;
    max-width: 320px;
  }
  .dl-hero__title {
    font-size: 44px;
  }
}

@media (max-width: $breakpoint-mobile) {
  .dl-hero {
    padding: 84px 20px 72px;
  }
  .dl-hero__title {
    font-size: 32px;
  }
  .dl-hero__desc {
    font-size: 15px;
  }
  .dl-hero__visual {
    height: 440px;
    max-width: 280px;
  }
  .dl-mock {
    width: 240px;
    height: 460px;
    padding: 8px;
  }
  .dl-mock__screen {
    padding: 24px 14px 22px;
  }
  .dl-mock__poster {
    height: 130px;
  }

  .dl-section {
    padding: 56px 16px 24px;
  }
  .dl-section__head h2 {
    font-size: 24px;
  }
  .dl-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .dl-notes-section {
    padding: 24px 16px 72px;
  }
  .dl-notes {
    padding: 24px 20px;
  }
}
</style>
