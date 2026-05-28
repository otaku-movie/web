<template>
  <button
    type="button"
    class="theme-toggle"
    :class="[`theme-toggle--${tone}`, `is-${theme}`]"
    :aria-label="theme === 'dark' ? labelLight : labelDark"
    :title="theme === 'dark' ? labelLight : labelDark"
    @click="toggle"
  >
    <span class="theme-toggle__thumb" aria-hidden="true" />
    <svg
      class="theme-toggle__icon theme-toggle__icon--sun"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.93 19.07 1.41-1.41" />
      <path d="m17.66 6.34 1.41-1.41" />
    </svg>
    <svg
      class="theme-toggle__icon theme-toggle__icon--moon"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'light' | 'dark' }>(), { tone: 'light' })

const { theme, toggle } = useTheme()
const { t } = useI18n()

const labelLight = computed(() => t('common.themeLight'))
const labelDark = computed(() => t('common.themeDark'))
</script>

<style lang="scss" scoped>
.theme-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 62px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid $border-default;
  background: $surface-card;
  color: $text-primary;
  cursor: pointer;
  padding: 0 8px;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    border-color: rgba(25, 137, 250, 0.5);
    box-shadow: 0 4px 14px -8px rgba(15, 23, 42, 0.2);
  }
}

.theme-toggle__thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: $gradient-brand;
  box-shadow: 0 8px 18px -10px rgba(25, 137, 250, 0.8);
  transition: transform 0.22s ease;
}

.theme-toggle.is-dark .theme-toggle__thumb {
  transform: translateX(26px);
}

.theme-toggle--dark {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.28);
  color: #fff;

  &:hover {
    background: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 255, 255, 0.45);
    box-shadow: none;
  }
}

.theme-toggle__icon {
  position: relative;
  z-index: 1;
  transition: transform 0.25s ease;
}

.theme-toggle__icon--sun,
.theme-toggle__icon--moon {
  color: $text-tertiary;
}

.theme-toggle.is-light .theme-toggle__icon--sun,
.theme-toggle.is-dark .theme-toggle__icon--moon {
  color: #fff;
}

.theme-toggle--dark .theme-toggle__icon--sun,
.theme-toggle--dark .theme-toggle__icon--moon {
  color: rgba(255, 255, 255, 0.7);
}

.theme-toggle--dark.is-light .theme-toggle__icon--sun,
.theme-toggle--dark.is-dark .theme-toggle__icon--moon {
  color: #fff;
}

.theme-toggle:hover .theme-toggle__icon {
  transform: scale(1.04);
}
</style>
