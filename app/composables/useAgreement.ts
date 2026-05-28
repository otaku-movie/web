/**
 * 协议详情拉取 - 共享给 /legal/[code].vue 等页面。
 *
 * 后端 (`/api/agreement/detail`) 用的语言码是 ja / zh / en
 * 与 nuxt-i18n 的 ja / zh-CN / en-US 不一致，这里统一做映射。
 */
export interface AgreementDetail {
  id?: number
  code: string
  language: string
  title: string
  content: string
  version?: string
  status?: string
  effectiveAt?: string
  publishedAt?: string
  updateTime?: string
}

interface RestBean<T> {
  code: number
  data: T
  message: string
}

/** nuxt-i18n locale -> 后端协议表 language */
export const toAgreementLang = (locale: string): 'zh' | 'ja' | 'en' => {
  const lower = (locale || '').toLowerCase()
  if (lower.startsWith('zh')) return 'zh'
  if (lower.startsWith('en')) return 'en'
  return 'ja'
}

/**
 * URL 上常见的"友好短码"到后台真实 code 的映射，
 * 让 /legal/terms、/legal/privacy 比 /legal/USER_TERMS 更适合贴到上架材料里。
 */
const SHORT_CODE_MAP: Record<string, string> = {
  terms: 'USER_TERMS',
  'user-terms': 'USER_TERMS',
  privacy: 'PRIVACY_POLICY',
  'privacy-policy': 'PRIVACY_POLICY',
  sdk: 'THIRD_PARTY_SDK',
  'third-party-sdk': 'THIRD_PARTY_SDK'
}

export const resolveAgreementCode = (raw: string): string => {
  const key = (raw || '').toLowerCase()
  if (SHORT_CODE_MAP[key]) return SHORT_CODE_MAP[key]
  return (raw || '').toUpperCase().replace(/-/g, '_')
}

export const useAgreement = (rawCode: string) => {
  const code = resolveAgreementCode(rawCode)
  const data = ref<AgreementDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAgreement = async () => {
    const { locale } = useI18n()
    loading.value = true
    error.value = null
    try {
      // 走同源 /api/*（由 Nuxt server route 转发到后端），避免浏览器端跨域问题
      const res = await $fetch<RestBean<AgreementDetail | null>>('/api/agreement/detail', {
        method: 'GET',
        query: { code, lang: toAgreementLang(locale.value) }
      })
      if (!res || typeof res !== 'object' || res.code !== 200) {
        throw new Error(res?.message || 'Request failed')
      }
      const detail = res.data
      data.value = detail && detail.content ? detail : null
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      data.value = null
    } finally {
      loading.value = false
    }
  }

  return { code, data, loading, error, fetchAgreement }
}
