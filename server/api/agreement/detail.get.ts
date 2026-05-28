import { defineEventHandler, getQuery } from 'h3'

/**
 * 同源转发：/api/agreement/detail -> {apiBase}/api/agreement/detail
 * 目的：前端页面在浏览器端请求也不会触发 CORS。
 */
export default defineEventHandler(async (event) => {
  const { public: pub } = useRuntimeConfig()
  const query = getQuery(event)

  const apiBase = pub.apiBase || 'http://localhost:8080'
  const url = `${apiBase}/api/agreement/detail`

  // 原样返回后端 RestBean 结构
  return await $fetch(url, {
    method: 'GET',
    query
  })
})

