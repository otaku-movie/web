export type Theme = 'light' | 'dark'

/**
 * 全站浅/深主题。
 *  - 默认 `light`，不再跟随系统 prefers-color-scheme
 *  - 用户通过 ThemeToggle 切换后写入 `mw_theme` cookie，刷新/SSR 同步保持
 *  - app.vue 中的 head inline script 会在首屏尽早设置 <html data-theme>，
 *    避免主题闪烁（FOUC）
 */
const DEFAULT_THEME: Theme = 'light'

export const useTheme = () => {
  const cookie = useCookie<Theme | null>('mw_theme', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  })

  /* 主题切换暂时下线：dark 模式待优化前，全站强制 light，忽略 mw_theme cookie。
   * 恢复时把 get 改回读取 cookie 即可：
   *   get: () => (cookie.value === 'dark' || cookie.value === 'light' ? cookie.value : DEFAULT_THEME) */
  const theme = computed<Theme>({
    get: () => DEFAULT_THEME,
    set: (val) => {
      cookie.value = val
    }
  })

  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const setTheme = (val: Theme) => {
    theme.value = val
  }

  return { theme, toggle, setTheme }
}
