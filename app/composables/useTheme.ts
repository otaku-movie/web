export type Theme = 'light' | 'dark'

/**
 * 全站浅/深主题。
 *  - mw_theme cookie 只保存用户手动选择
 *  - 没有 cookie 时跟随系统 prefers-color-scheme
 *  - app.vue 中的 head inline script 会在首屏尽早设置 <html data-theme>
 */
export const useTheme = () => {
  const cookie = useCookie<Theme | null>('mw_theme', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  })

  const systemTheme = useState<Theme>('mw-system-theme', () => 'light')

  if (import.meta.client) {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const syncSystemTheme = () => {
      systemTheme.value = media.matches ? 'dark' : 'light'
    }

    syncSystemTheme()

    onMounted(() => {
      media.addEventListener('change', syncSystemTheme)
    })
    onBeforeUnmount(() => {
      media.removeEventListener('change', syncSystemTheme)
    })
  }

  const theme = computed<Theme>({
    get: () => {
      if (cookie.value === 'dark' || cookie.value === 'light') return cookie.value
      return systemTheme.value
    },
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

  const resetTheme = () => {
    cookie.value = null
  }

  const usingSystemTheme = computed(() => cookie.value !== 'dark' && cookie.value !== 'light')

  return { theme, toggle, setTheme, resetTheme, usingSystemTheme }
}
