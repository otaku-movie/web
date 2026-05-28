<template>
  <div
    class="app-image-frame"
    :class="{
      'is-loaded': loaded,
      'is-failed': failed,
      'is-loading': hasSrc && !loaded && !failed,
      'is-empty': !hasSrc,
      'is-compact': compact
    }"
    :style="wrapperStyle"
  >
    <slot name="fallback">
      <div class="app-image__fallback" aria-hidden="true">
        <span class="app-image__mark">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2.4" ry="2.4" />
            <circle cx="9" cy="9" r="1.6" />
            <path d="m21 15-3.5-3.5a2 2 0 0 0-2.83 0L6 21" />
          </svg>
        </span>
        <span v-if="label && !compact" class="app-image__text">{{ label }}</span>
      </div>
    </slot>
    <img
      v-if="hasSrc && !failed"
      ref="imgEl"
      :src="resolvedSrc"
      :alt="alt"
      :loading="loading"
      :decoding="decoding"
      class="app-image"
      :style="imageStyle"
      @error="onError"
      @load="onLoad"
    />
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

/**
 * 全站通用图片组件，封装"加载占位 + 失败兜底"逻辑。
 *
 * - 占位永远作为底层铺满容器；`<img>` 默认透明、加载成功后淡入。
 *   这样浏览器在请求失败前不会先露出默认的「破图图标 + alt 文本」。
 * - 当 `src` 为空 / 加载失败时，占位常驻显示。
 * - 通过 `#fallback` slot 可自定义占位内容。
 * - `src` 变化会自动重置加载/失败状态。
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

const emit = defineEmits<{
  (e: 'error', event: Event): void
  (e: 'load', event: Event): void
}>()

const toCssSize = (v?: string | number) => {
  if (v == null || v === '') return undefined
  return typeof v === 'number' ? `${v}px` : v
}

const wrapperStyle = computed<CSSProperties>(() => ({
  width: toCssSize(props.width),
  height: toCssSize(props.height)
}))

const imageStyle = computed<CSSProperties>(() => ({
  objectFit: props.objectFit
}))

const failed = ref(false)
const loaded = ref(false)
const imgEl = ref<HTMLImageElement | null>(null)

/**
 * SSR / 浏览器磁盘缓存场景下，当 Vue 给 <img> 绑定 load 监听时图片可能已经 complete，
 * 这种情况下 @load 不会再触发，会导致占位永远盖在已经下载好的图片上。
 * 这里在挂载与 src 变化后立即兜底一次：如果原生 img 已经 complete 且尺寸有效，直接当作 loaded。
 */
const reconcileFromComplete = () => {
  const el = imgEl.value
  if (!el) return
  if (el.complete && el.naturalWidth > 0) {
    loaded.value = true
  }
}

onMounted(reconcileFromComplete)

/**
 * 自动按 `NUXT_PUBLIC_IMAGE_BASE` 拼接前缀：
 * 后端如果只返回相对路径（如 `2024-06-01/image/xxx.png`），
 * 在这里统一兜底，调用方就不用每处手动处理。
 * `getImageUrl` 对已经是完整 URL / data: / blob: 的输入幂等。
 */
const resolvedSrc = computed(() => getImageUrl(props.src) || undefined)
const hasSrc = computed(() => Boolean(resolvedSrc.value))

watch(
  () => props.src,
  () => {
    failed.value = false
    loaded.value = false
    nextTick(reconcileFromComplete)
  }
)

const onError = (event: Event) => {
  failed.value = true
  loaded.value = false
  emit('error', event)
}

const onLoad = (event: Event) => {
  loaded.value = true
  emit('load', event)
}
</script>

<style lang="scss" scoped>
.app-image-frame {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.app-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  opacity: 0;
  transition: opacity 320ms ease;
}

.app-image-frame.is-loaded .app-image {
  opacity: 1;
}

.app-image__fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.55);
  background:
    radial-gradient(60% 50% at 50% 38%, rgba(255, 255, 255, 0.05) 0%, transparent 70%),
    linear-gradient(180deg, #1a2336 0%, #0f1626 100%);
  transition: opacity 320ms ease;

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

/* 紧凑模式去掉网格底纹，并缩小图标 */
.app-image-frame.is-compact .app-image__fallback {
  background: linear-gradient(180deg, #1a2336 0%, #0f1626 100%);
  &::before { display: none; }
}

/* 加载中：在 fallback 上叠一层 shimmer，让用户感知到「正在拉」 */
.app-image-frame.is-loading .app-image__fallback::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    transparent 35%,
    rgba(255, 255, 255, 0.07) 50%,
    transparent 65%
  );
  background-size: 220% 100%;
  animation: app-image-shimmer 1.8s linear infinite;
  pointer-events: none;
}

/* 图片成功加载后，让 fallback 退出 */
.app-image-frame.is-loaded .app-image__fallback {
  opacity: 0;
  pointer-events: none;
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

.app-image-frame.is-compact .app-image__mark {
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

@keyframes app-image-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

/* 减少动效偏好：直接关掉 shimmer，避免对前庭敏感用户造成困扰 */
@media (prefers-reduced-motion: reduce) {
  .app-image-frame.is-loading .app-image__fallback::after {
    animation: none;
  }
  .app-image,
  .app-image__fallback {
    transition: none;
  }
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

:global(html[data-theme='light']) .app-image-frame.is-compact .app-image__fallback {
  background: linear-gradient(180deg, #eef2f8 0%, #dde5f0 100%);
}

:global(html[data-theme='light']) .app-image-frame.is-loading .app-image__fallback::after {
  background: linear-gradient(
    110deg,
    transparent 35%,
    rgba(15, 23, 42, 0.05) 50%,
    transparent 65%
  );
}

:global(html[data-theme='light']) .app-image__mark {
  background: rgba(15, 23, 42, 0.06);
  color: rgba(15, 23, 42, 0.55);
}

:global(html[data-theme='light']) .app-image__text {
  color: rgba(15, 23, 42, 0.5);
}
</style>
