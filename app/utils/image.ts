/**
 * 把后端返回的图片相对路径拼成完整 URL，逻辑与 admin `utils/index.ts#getURL` 对齐：
 *  - 已是 http(s) / data: / blob: / 协议相对（//xxx）的，原样返回
 *  - 否则用传入的 base 作为前缀拼接，规范化中间的斜杠
 *
 * 注意：函数本身不读 runtimeConfig / process.env，避免在 await 之后丢 Nuxt 上下文。
 * 调用方在 setup / 顶层同步处通过 `useRuntimeConfig().public.imageBase` 取 base 后传入。
 */
export const getImageUrl = (url?: string | null, base = ''): string => {
  if (!url) return ''
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url
  }
  if (!base) return url
  const trimmedBase = base.replace(/\/+$/, '')
  const path = url.startsWith('/') ? url : `/${url}`
  return `${trimmedBase}${path}`
}

/**
 * 读取当前 Nuxt 运行时配置中的 imageBase，必须在 setup 同步段调用。
 * 返回的字符串已去掉尾部斜杠，可直接交给 {@link getImageUrl} 使用。
 */
export const useImageBase = (): string => {
  const { public: pub } = useRuntimeConfig()
  return String(pub.imageBase || '').replace(/\/+$/, '')
}
