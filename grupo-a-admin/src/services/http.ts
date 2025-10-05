import axios from 'axios'

type StoredSession = {
  access?: string
}

function getAccessToken(): string | undefined {
  const raw = localStorage.getItem('auth')
  if (!raw) return undefined
  try {
    const session = JSON.parse(raw) as StoredSession
    return session?.access
  } catch (error) {
    console.error('[http] failed to parse session from storage', error)
    localStorage.removeItem('auth')
    return undefined
  }
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

