<template>
  <div
    class="platform-card"
    :class="[`platform-card--${platform}`, { 'is-active': active }]"
    role="button"
    tabindex="0"
    @click="$emit('activate', platform)"
    @keydown.enter.space.prevent="$emit('activate', platform)"
  >
    <span v-if="currentDevice" class="platform-card__badge">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 14.5L6.5 12l1.4-1.4L11 13.7l5.1-5.1 1.4 1.4Z" /></svg>
      {{ t('download.currentDevice') }}
    </span>

    <div class="platform-card__head">
      <span class="platform-card__logo">
        <slot name="logo" />
      </span>
      <div class="platform-card__title">
        <span class="platform-card__platform">{{ platformLabel }}</span>
        <span v-if="item?.versionName" class="platform-card__version">
          v{{ item.versionName }}
          <span v-if="item.buildNumber" class="platform-card__build">
            · {{ t('download.build') }} {{ item.buildNumber }}
          </span>
        </span>
        <span v-else class="platform-card__version platform-card__version--muted">
          {{ t('download.comingSoon') }}
        </span>
      </div>
    </div>

    <dl class="platform-card__meta">
      <div v-if="item?.publishedAt">
        <dt>{{ t('download.published') }}</dt>
        <dd>{{ item.publishedAt }}</dd>
      </div>
      <div v-if="item?.minSupportedVersion">
        <dt>{{ t('download.minSupported') }}</dt>
        <dd>{{ item.minSupportedVersion }}</dd>
      </div>
    </dl>

    <span v-if="item?.forceUpdate" class="mw-tag mw-tag--warning platform-card__force-tag">
      {{ t('download.forceUpdateTip') }}
    </span>

    <a
      class="mw-button platform-card__cta"
      :class="{ 'is-disabled': !downloadable }"
      :href="downloadable ? item?.downloadUrl : undefined"
      :target="downloadable ? '_blank' : undefined"
      rel="noopener noreferrer"
      @click.stop
    >
      <span>{{ ctaLabel }}</span>
      <svg v-if="downloadable" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></svg>
    </a>
  </div>
</template>

<script setup lang="ts">
import type { LatestVersionItem } from '~/composables/useLatestVersion'

const props = defineProps<{
  platform: 'android' | 'ios'
  item?: LatestVersionItem | null
  active?: boolean
  currentDevice?: boolean
}>()

defineEmits<{
  (event: 'activate', platform: 'android' | 'ios'): void
}>()

const { t } = useI18n()

const platformLabel = computed(() => t(`download.platform.${props.platform}`))
const ctaLabel = computed(() =>
  props.platform === 'ios' ? t('download.downloadIos') : t('download.downloadAndroid')
)
const downloadable = computed(() => Boolean(props.item?.downloadUrl))
</script>

<style lang="scss" scoped>
.platform-card {
  position: relative;
  background: $surface-card;
  border-radius: $radius-xl;
  padding: 32px 28px 28px;
  box-shadow: $shadow-card;
  display: flex;
  flex-direction: column;
  gap: 20px;
  cursor: pointer;
  border: 2px solid transparent;
  box-sizing: border-box;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 28px 50px -16px rgba(15, 23, 42, 0.22);
  }

  &.is-active {
    border-color: $brand-primary;
    box-shadow: $shadow-card-active;
  }
}

.platform-card__badge {
  position: absolute;
  top: 14px;
  right: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(25, 137, 250, 0.12);
  color: $brand-primary;
  font-size: 12px;
  font-weight: 600;
}

.platform-card__head {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.platform-card__logo {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 10px 24px -10px rgba(15, 23, 42, 0.22);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 4px;
  overflow: hidden;

  :slotted(img) {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
}

:global(html[data-theme='dark']) .platform-card__logo {
  background: #ffffff;
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 10px 24px -10px rgba(0, 0, 0, 0.55);
}

.platform-card__title {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.platform-card__platform {
  font-size: 20px;
  font-weight: 600;
  color: $text-primary;
  line-height: 1.2;
}

.platform-card__version {
  font-size: 14px;
  color: $text-primary;
  font-weight: 500;

  &--muted {
    color: $text-tertiary;
    font-weight: 400;
  }
}

.platform-card__build {
  color: $text-tertiary;
  font-weight: 400;
}

.platform-card__meta {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  > div {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-size: 13px;
    line-height: 1.5;
  }

  dt {
    margin: 0;
    color: $text-tertiary;
    flex-shrink: 0;

    &::after {
      content: '：';
    }
  }

  dd {
    margin: 0;
    color: $text-secondary;
  }
}

.platform-card__force-tag {
  align-self: flex-start;
}

.platform-card__cta {
  height: 48px;

  &.is-disabled {
    background: $border-default;
    color: $text-tertiary;
    cursor: not-allowed;
    box-shadow: none;
    pointer-events: none;
  }

  &:hover svg {
    transform: translateX(3px);
  }

  svg {
    transition: transform 0.2s ease;
  }
}
</style>
