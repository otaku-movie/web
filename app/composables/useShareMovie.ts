export interface ShareMovieDetail {
  id: number
  name: string
  originalName?: string
  cover?: string
  description?: string
  duration?: number
  startDate?: string
  status?: number
  watchedCount?: number
  wantToSeeCount?: number
  tags?: string[]
  rating?: number | null
  ratingCount?: number
  homePage?: string
}

export const useShareMovie = (id: number | string) => {
  const data = ref<ShareMovieDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchMovie = async () => {
    const imageBase = useImageBase()
    loading.value = true
    error.value = null
    try {
      const detail = await useApi<ShareMovieDetail>(`/api/app/share/movie/${id}`, {
        method: 'GET'
      })
      data.value = {
        ...detail,
        cover: getImageUrl(detail.cover, imageBase) || undefined
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      data.value = null
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchMovie }
}

/**
 * UA 探测 - 简易版
 */
export type DetectedOS = 'android' | 'ios' | 'other'

export const detectOs = (): DetectedOS => {
  if (typeof navigator === 'undefined') return 'other'
  const ua = navigator.userAgent || ''
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  return 'other'
}
