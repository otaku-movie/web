<template>
  <div class="legal-page">
    <SiteHeader />

    <main class="legal-main">
      <div v-if="loading" class="legal-state">
        <div class="mw-spinner" />
      </div>

      <div v-else-if="error || !data" class="legal-state">
        <p>{{ error ? t('common.loadFailed') : t('legal.empty') }}</p>
        <button v-if="error" class="mw-button mw-button--ghost" @click="fetchAgreement">
          {{ t('common.retry') }}
        </button>
        <NuxtLink class="mw-button" to="/">{{ t('nav.home') }}</NuxtLink>
      </div>

      <article v-else class="legal-card">
        <header class="legal-card__head">
          <span class="legal-card__chip">
            <span class="legal-card__chip-dot" />
            {{ chipText }}
          </span>
          <h1 class="legal-card__title">{{ data.title }}</h1>

          <dl v-if="metaItems.length" class="legal-card__meta">
            <div v-for="item in metaItems" :key="item.label" class="legal-card__meta-item">
              <dt>{{ item.label }}</dt>
              <dd>{{ item.value }}</dd>
            </div>
          </dl>
        </header>

        <div class="legal-card__body markdown-body" v-html="renderedHtml" />
      </article>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'

const route = useRoute()
const { t, locale } = useI18n()
const { public: pub } = useRuntimeConfig()

const rawCode = computed(() => String(route.params.code || ''))
const { code, data, loading, error, fetchAgreement } = useAgreement(rawCode.value)

const formatDate = (raw?: string) => {
  if (!raw) return ''
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw
  const pad = (v: number) => String(v).padStart(2, '0')
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`
}

const resolvePlaceholders = (src: string) => {
  if (!src) return ''
  const brandName = t('brand.name')
  const supportEmail = pub.supportEmail || 'support@example.com'
  const effective =
    formatDate(data.value?.effectiveAt) ||
    formatDate(data.value?.publishedAt) ||
    (data.value?.version ? `v${data.value.version}` : '')
  const lastUpdated =
    formatDate(data.value?.updateTime) ||
    formatDate(data.value?.publishedAt) ||
    effective
  return src
    .replace(/\{\{APP_NAME\}\}/g, brandName)
    .replace(/\{\{COMPANY_NAME\}\}/g, brandName)
    .replace(/\{\{DPO_EMAIL\}\}/g, supportEmail)
    .replace(/\{\{SUPPORT_EMAIL\}\}/g, supportEmail)
    .replace(/\{\{EFFECTIVE_DATE\}\}/g, effective || '—')
    .replace(/\{\{LAST_UPDATED\}\}/g, lastUpdated || '—')
    .replace(/\{\{[A-Z_]+\}\}/g, '—')
}

const renderedHtml = computed(() => {
  if (!data.value?.content) return ''
  return marked.parse(resolvePlaceholders(data.value.content)) as string
})

const chipText = computed(() => {
  const map: Record<string, string> = {
    USER_TERMS: t('legal.chip.terms'),
    PRIVACY_POLICY: t('legal.chip.privacy'),
    THIRD_PARTY_SDK: t('legal.chip.sdk')
  }
  return map[code] || t('legal.chip.default')
})

interface MetaItem {
  label: string
  value: string
}

const metaItems = computed<MetaItem[]>(() => {
  if (!data.value) return []
  const items: MetaItem[] = []
  if (data.value.version) {
    items.push({ label: t('legal.meta.version'), value: data.value.version })
  }
  const effective = formatDate(data.value.effectiveAt) || formatDate(data.value.publishedAt)
  if (effective) {
    items.push({ label: t('legal.meta.effectiveAt'), value: effective })
  }
  const updated = formatDate(data.value.updateTime)
  if (updated) {
    items.push({ label: t('legal.meta.updatedAt'), value: updated })
  }
  return items
})

await fetchAgreement()

watch(locale, () => {
  fetchAgreement()
})

useSeoMeta({
  title: () => (data.value ? `${data.value.title} | ${t('brand.name')}` : t('legal.fallbackTitle')),
  description: () => data.value?.title || t('legal.fallbackTitle')
})
</script>

<style lang="scss" scoped>
.legal-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: $surface-canvas;
  color: $text-primary;
}

.legal-main {
  flex: 1;
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
  padding: 40px 24px 72px;
}

.legal-state {
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

.legal-card {
  background: $surface-card;
  border: 1px solid $border-default;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 28px 70px -36px rgba(0, 0, 0, 0.45);
}

:global(html[data-theme='light']) .legal-card {
  border-color: rgba(15, 23, 42, 0.08);
  box-shadow: 0 28px 70px -32px rgba(15, 23, 42, 0.18);
}

.legal-card__head {
  padding: 36px 40px 24px;
  border-bottom: 1px solid $border-subtle;
  background:
    radial-gradient(460px 240px at 90% 0%, rgba(139, 92, 246, 0.1), transparent 60%),
    radial-gradient(380px 220px at 10% 0%, rgba(25, 137, 250, 0.08), transparent 65%);
}

.legal-card__chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  border-radius: 999px;
  background: rgba(25, 137, 250, 0.1);
  color: $brand-primary;
  font-size: 13px;
  font-weight: 600;
}

.legal-card__chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: $brand-primary;
  box-shadow: 0 0 0 4px rgba(25, 137, 250, 0.16);
}

.legal-card__title {
  margin: 16px 0 18px;
  font-size: clamp(26px, 2.4vw, 34px);
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: $text-primary;
}

.legal-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 28px;
  margin: 0;
}

.legal-card__meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;

  dt {
    margin: 0;
    font-size: 12px;
    color: $text-tertiary;
    letter-spacing: 0.2px;
  }

  dd {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: $text-primary;
  }
}

.legal-card__body {
  padding: 32px 40px 48px;
  color: $text-secondary;
  font-size: 15px;
  line-height: 1.85;

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4) {
    color: $text-primary;
    line-height: 1.3;
    margin: 28px 0 12px;
  }

  :deep(h1) {
    font-size: 24px;
    font-weight: 700;
  }

  :deep(h2) {
    font-size: 20px;
    font-weight: 700;
    margin-top: 32px;
  }

  :deep(h3) {
    font-size: 17px;
    font-weight: 600;
  }

  :deep(p) {
    margin: 10px 0;
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 22px;
    margin: 12px 0;
  }

  :deep(li) {
    margin: 6px 0;
  }

  :deep(a) {
    color: $brand-primary;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  :deep(blockquote) {
    margin: 16px 0;
    padding: 12px 18px;
    background: rgba(25, 137, 250, 0.08);
    border-left: 3px solid $brand-primary;
    border-radius: 0 12px 12px 0;
    color: $text-primary;
  }

  :deep(hr) {
    border: none;
    border-top: 1px solid $border-subtle;
    margin: 28px 0;
  }

  :deep(code) {
    background: rgba(15, 23, 42, 0.06);
    color: $text-primary;
    padding: 2px 6px;
    border-radius: 6px;
    font-size: 13px;
  }

  :global(html[data-theme='dark']) :deep(code) {
    background: rgba(255, 255, 255, 0.08);
  }

  :deep(pre) {
    background: rgba(15, 23, 42, 0.06);
    padding: 14px 16px;
    border-radius: 12px;
    overflow-x: auto;
    line-height: 1.6;
  }

  :global(html[data-theme='dark']) :deep(pre) {
    background: rgba(255, 255, 255, 0.05);
  }

  :deep(table) {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 20px 0;
    font-size: 14px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid $border-default;
    background: $surface-card;
  }

  :deep(th),
  :deep(td) {
    padding: 12px 16px;
    border-right: 1px solid $border-default;
    border-bottom: 1px solid $border-default;
    text-align: left;
    vertical-align: top;
  }

  :deep(th:last-child),
  :deep(td:last-child) {
    border-right: none;
  }

  :deep(tr:last-child td) {
    border-bottom: none;
  }

  :deep(thead th) {
    background: rgba(15, 23, 42, 0.045);
    color: $text-primary;
    font-weight: 600;
    border-bottom: 1px solid $border-default;
  }

  :deep(tbody tr:nth-child(even) td) {
    background: rgba(15, 23, 42, 0.018);
  }

  :global(html[data-theme='dark']) :deep(table) {
    background: $surface-card;
  }

  :global(html[data-theme='dark']) :deep(thead th) {
    background: rgba(255, 255, 255, 0.06);
  }

  :global(html[data-theme='dark']) :deep(tbody tr:nth-child(even) td) {
    background: rgba(255, 255, 255, 0.025);
  }
}

@media (max-width: $breakpoint-tablet) {
  .legal-main {
    padding: 24px 16px 56px;
  }
  .legal-card__head {
    padding: 28px 24px 20px;
  }
  .legal-card__body {
    padding: 24px 24px 36px;
  }
}
</style>
