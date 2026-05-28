export interface HomeHighlightItem {
  id: number
  name: string
  originalName?: string
  cover?: string
  year?: string
  duration?: number
  rating?: number | null
}

export const useHomeHighlights = () => {
  const data = ref<HomeHighlightItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchHighlights = async () => {
    // 必须在 await 之前拿 base，否则 Nuxt 上下文可能丢失
    const imageBase = useImageBase()
    loading.value = true
    error.value = null
    try {
      const list = await useApi<HomeHighlightItem[]>('/api/app/home/highlights', {
        method: 'GET'
      })
      data.value = (list || []).map((item) => ({
        ...item,
        cover: getImageUrl(item.cover, imageBase) || undefined
      }))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      data.value = []
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchHighlights }
}
