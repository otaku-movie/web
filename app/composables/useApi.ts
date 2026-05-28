/**
 * 统一封装后端 ApiResponse 结构与错误处理，避免每个页面重复 try/catch
 */
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

export type RequestOptions = Parameters<typeof $fetch>[1]

export const useApi = async <T = unknown>(
  url: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { public: pub } = useRuntimeConfig()
  const { locale } = useI18n()

  const res = await $fetch<ApiResponse<T>>(url, {
    baseURL: pub.apiBase,
    headers: {
      'Accept-Language': locale.value,
      ...(options.headers || {})
    },
    ...options
  })

  if (!res || typeof res !== 'object' || !('code' in res)) {
    throw new Error('Invalid response shape')
  }
  if (res.code !== 200) {
    throw new Error(res.message || `Request failed with code ${res.code}`)
  }
  return res.data
}
