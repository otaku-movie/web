<template>
  <img
    v-if="showImg"
    :src="resolvedSrc"
    :alt="alt"
    :loading="loading"
    :decoding="decoding"
    class="app-image"
    :style="sizeStyle"
    @error="onError"
    @load="onLoad"
  />
  <slot v-else name="fallback">
    <div class="app-image__fallback" :class="{ 'is-compact': compact }" :style="sizeStyle">
      <span class="app-image__mark" aria-hidden="true">
        <!-- Lucide image: 相框 + 山 + 太阳，通用「无图」语义 -->
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2.4" ry="2.4" />
          <circle cx="9" cy="9" r="1.6" />
          <path d="m21 15-3.5-3.5a2 2 0 0 0-2.83 0L6 21" />
        </svg>
      </span>
      <span v-if="label && !compact" class="app-image__text">{{ label }}</span>
    </div>
  </slot>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

/**
 * 全站通用图片组件，封装"加载失败 → 占位"逻辑。
 *
 * - 当 `src` 为空 / 加载失败时，渲染 `#fallback` slot 内容。
 * - 未传 slot 时，提供一份「相框图标 + 可选文案」的默认占位。
 * - `src` 变化时自动重置失败状态，重新尝试加载新图。
 * - 通过 `width` / `height` / `objectFit` 控制尺寸与裁切方式，
 *   值为数字按 px 处理，字符串则原样作为 CSS 长度（如 '100%' / '12rem'）。
 */
const props = withDefaults(
  defineProps<{
    src?: string | null
    alt?: string
    loading?: 'lazy' | 'eager'
    decoding?: 'async' | 'sync' | 'auto'
    /** 默认占位下方的辅助文案，留空则只显示图标 */
    label?: string
    /** 紧凑模式：仅显示图标、不显示文案，适合小卡片占位 */
    compact?: boolean
    /** 宽度：数字按 px，字符串原样（如 '100%' / '12rem'）。不传则跟随容器。 */
    width?: string | number
    /** 高度：同 width。不传则跟随容器。 */
    height?: string | number
    /** 裁切方式，默认 cover；如希望完整显示海报可传 'contain'。 */
    objectFit?: CSSProperties['objectFit']
  }>(),
  {
    src: '',
    alt: '',
    loading: 'lazy',
    decoding: 'async',
    label: '',
    compact: false,
    width: undefined,
    height: undefined,
    objectFit: 'cover'
  }
)

const toCssSize = (v?: string | number) => {
  if (v == null || v === '') return undefined
  return typeof v === 'number' ? `${v}px` : v
}

const sizeStyle = computed<CSSProperties>(() => ({
  width: toCssSize(props.width),
  height: toCssSize(props.height),
  objectFit: props.objectFit
}))

const emit = defineEmits<{
  (e: 'error', event: Event): void
  (e: 'load', event: Event): void
}>()

const failed = ref(false)

/**
 * 自动按 `NUXT_PUBLIC_IMAGE_BASE` 拼接前缀：
 * 后端如果只返回相对路径（如 `2024-06-01/image/xxx.png`），
 * 在这里统一兜底，调用方就不用每处手动处理。
 * `getImageUrl` 对已经是完整 URL / data: / blob: 的输入幂等。
 */
const resolvedSrc = computed(() => getImageUrl(props.src) || undefined)

const showImg = computed(() => Boolean(resolvedSrc.value) && !failed.value)

watch(
  () => props.src,
  () => {
    failed.value = false
  }
)

const onError = (event: Event) => {
  failed.value = true
  emit('error', event)
}

const onLoad = (event: Event) => {
  emit('load', event)
}
</script>

<style lang="scss" scoped>
.app-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.app-image__fallback {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.55);
  background:
    radial-gradient(60% 50% at 50% 38%, rgba(255, 255, 255, 0.05) 0%, transparent 70%),
    linear-gradient(180deg, #1a2336 0%, #0f1626 100%);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 28px 28px;
    background-position: -1px -1px;
    mask-image: radial-gradient(circle at center, #000 0%, transparent 80%);
    -webkit-mask-image: radial-gradient(circle at center, #000 0%, transparent 80%);
    pointer-events: none;
  }
}

.app-image__fallback.is-compact {
  &::before { display: none; }
  background: linear-gradient(180deg, #1a2336 0%, #0f1626 100%);
}

.app-image__mark {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.78);
  position: relative;
}

.app-image__fallback.is-compact .app-image__mark {
  width: 32px;
  height: 32px;
  border-radius: 10px;
}

.app-image__text {
  font-size: 12px;
  letter-spacing: 0.4px;
  font-weight: 500;
  position: relative;
  color: rgba(255, 255, 255, 0.5);
}

:global(html[data-theme='light']) .app-image__fallback {
  color: rgba(15, 23, 42, 0.5);
  background:
    radial-gradient(60% 50% at 50% 38%, rgba(25, 137, 250, 0.08) 0%, transparent 70%),
    linear-gradient(180deg, #eef2f8 0%, #dde5f0 100%);

  &::before {
    background-image:
      linear-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(15, 23, 42, 0.05) 1px, transparent 1px);
  }
}

:global(html[data-theme='light']) .app-image__fallback.is-compact {
  background: linear-gradient(180deg, #eef2f8 0%, #dde5f0 100%);
}

:global(html[data-theme='light']) .app-image__mark {
  background: rgba(15, 23, 42, 0.06);
  color: rgba(15, 23, 42, 0.55);
}

:global(html[data-theme='light']) .app-image__text {
  color: rgba(15, 23, 42, 0.5);
}
</style>
