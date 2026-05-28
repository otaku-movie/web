export interface LatestVersionItem {
  platform: 'Android' | 'IOS'
  versionName: string
  buildNumber?: number
  downloadUrl?: string
  releaseNote?: string
  minSupportedVersion?: string
  forceUpdate?: boolean
  publishedAt?: string
}

export interface LatestVersionResponse {
  android?: LatestVersionItem | null
  ios?: LatestVersionItem | null
}

export const useLatestVersion = () => {
  const data = ref<LatestVersionResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchLatest = async () => {
    loading.value = true
    error.value = null
    try {
      data.value = await useApi<LatestVersionResponse>('/api/app/version/latest', {
        method: 'GET'
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchLatest }
}
