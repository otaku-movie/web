<template>
  <div class="error-page">
    <SiteHeader />

    <main class="error-main">
      <section class="error-card">
        <span class="error-card__icon">
          <img src="/brand-icon.png" alt="" aria-hidden="true" />
        </span>
        <p class="error-card__eyebrow">{{ statusCode }}</p>
        <h1>{{ title }}</h1>
        <p class="error-card__desc">{{ desc }}</p>
        <div class="error-card__actions">
          <button class="mw-button" type="button" @click="goHome">
            {{ t('nav.home') }}
          </button>
          <button class="mw-button mw-button--ghost" type="button" @click="reload">
            {{ t('common.retry') }}
          </button>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()

const statusCode = computed(() => props.error?.statusCode || 500)
const title = computed(() =>
  statusCode.value === 404 ? t('common.notFound') : t('common.loadFailed')
)
const desc = computed(() =>
  statusCode.value === 404
    ? t('error.notFoundDesc')
    : t('error.defaultDesc')
)

const goHome = () => clearError({ redirect: '/' })
const reload = () => {
  if (import.meta.client) window.location.reload()
}
</script>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: $surface-canvas;
  color: $text-primary;
}

.error-main {
  flex: 1;
  display: grid;
  place-items: center;
  padding: 56px 24px 72px;
}

.error-card {
  width: min(100%, 560px);
  background: $surface-card;
  border: 1px solid $border-subtle;
  border-radius: $radius-xl;
  box-shadow: $shadow-card;
  padding: 44px 36px;
  text-align: center;

  h1 {
    margin: 8px 0 10px;
    font-size: clamp(26px, 3vw, 36px);
    line-height: 1.2;
  }
}

.error-card__icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 18px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 14px 30px -18px rgba(15, 23, 42, 0.35);
  padding: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.error-card__eyebrow {
  margin: 0;
  color: $brand-primary;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.error-card__desc {
  margin: 0 auto;
  max-width: 420px;
  color: $text-secondary;
}

.error-card__actions {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: $breakpoint-mobile) {
  .error-main {
    padding: 40px 16px 56px;
  }
  .error-card {
    padding: 34px 22px;
  }
}
</style>
