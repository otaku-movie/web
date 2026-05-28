<template>
  <DropdownMenuRoot v-model:open="open">
    <div class="lang-switch" :class="{ 'is-open': open, 'is-dark': dark }">
      <DropdownMenuTrigger as-child>
        <button
          type="button"
          class="lang-switch__trigger"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18Z" />
          </svg>
          <span class="lang-switch__label">{{ currentLabel }}</span>
          <svg
            class="lang-switch__chevron"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          class="lang-switch__menu"
          align="end"
          :side-offset="8"
        >
          <DropdownMenuItem
            v-for="loc in items"
            :key="loc.code"
            :class="['lang-switch__item', { 'is-active': loc.code === locale }]"
            @select="select(loc.code)"
          >
            <span class="lang-switch__flag">{{ loc.flag }}</span>
            <span class="lang-switch__name">{{ loc.name }}</span>
            <svg
              v-if="loc.code === locale"
              class="lang-switch__check"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </div>
  </DropdownMenuRoot>
</template>

<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger
} from 'reka-ui'

withDefaults(defineProps<{ dark?: boolean }>(), { dark: false })

const { locale, locales, setLocale } = useI18n()

const FLAG_MAP: Record<string, string> = {
  'zh-CN': '🇨🇳',
  ja: '🇯🇵',
  'en-US': '🇺🇸'
}

const items = computed(() =>
  (locales.value as Array<{ code: string; name?: string }>).map((l) => ({
    code: l.code,
    name: l.name || l.code,
    flag: FLAG_MAP[l.code] || '🌐'
  }))
)

const currentLabel = computed(
  () => items.value.find((i) => i.code === locale.value)?.name || locale.value
)

const open = ref(false)

const select = (code: string) => {
  open.value = false
  if (code !== locale.value) {
    setLocale(code as 'zh-CN' | 'ja' | 'en-US')
  }
}
</script>

<style lang="scss" scoped>
.lang-switch {
  position: relative;
  display: inline-block;
}

.lang-switch__trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  background: $overlay-strong;
  border: 1px solid $border-default;
  color: $text-primary;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    background: $surface-card;
    border-color: rgba(25, 137, 250, 0.5);
    box-shadow: 0 4px 14px -8px rgba(15, 23, 42, 0.2);
  }
}

.lang-switch__label {
  white-space: nowrap;
}

.lang-switch__chevron {
  transition: transform 0.2s ease;
  opacity: 0.7;
}

.is-open .lang-switch__chevron {
  transform: rotate(180deg);
}

/* 浮层相关样式迁到下方非 scoped 的 <style> 中，
   因为 Reka 的 DropdownMenuPortal 会把菜单 teleport 到 <body>，
   scoped 的 [data-v-xxx] 选择器在 teleport 后不一定生效。 */

// Dark / on-gradient 形态：用于深色 hero 背景上的 header
.is-dark .lang-switch__trigger {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.28);
  color: #fff;

  &:hover {
    background: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 255, 255, 0.45);
    box-shadow: none;
  }
}

</style>

<style lang="scss">
/* 非 scoped：作用于 Reka teleport 到 body 的菜单浮层 */
.lang-switch__menu {
  min-width: 168px;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: $surface-card;
  border-radius: 14px;
  box-shadow: $shadow-popover;
  border: 1px solid $border-subtle;
  z-index: 60;
  transform-origin: var(--reka-dropdown-menu-content-transform-origin);
  outline: none;

  &[data-state='open'] {
    animation: lang-switch-in 0.15s ease;
  }

  &[data-state='closed'] {
    animation: lang-switch-out 0.15s ease;
  }
}

.lang-switch__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  color: $text-primary;
  cursor: pointer;
  font-size: 14px;
  outline: none;
  user-select: none;
  transition: background 0.15s ease;

  &:hover,
  &:focus-visible,
  &[data-highlighted] {
    background: rgba(25, 137, 250, 0.08);
  }

  &.is-active {
    color: $brand-primary;
    font-weight: 600;
  }
}

.lang-switch__flag {
  font-size: 16px;
  line-height: 1;
}

.lang-switch__name {
  flex: 1;
  min-width: 0;
}

.lang-switch__check {
  color: $brand-primary;
}

@keyframes lang-switch-in {
  from {
    transform: translateY(-4px) scale(0.98);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes lang-switch-out {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(-4px) scale(0.98);
    opacity: 0;
  }
}
</style>
