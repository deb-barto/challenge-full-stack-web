import { defineStore } from 'pinia'
import { http } from '../services/http'
import type { LoginDTO, SessionDTO } from '../types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    session: null as SessionDTO | null,
  }),
  actions: {
    async login(payload: LoginDTO) {
      const { data } = await http.post<SessionDTO>('/auth/login', payload)
      this.setSession(data)
      return data
    },
    setSession(session: SessionDTO) {
      this.session = session
      localStorage.setItem('auth', JSON.stringify(session))
    },
    loadSession() {
      const raw = localStorage.getItem('auth')
      if (!raw) return
      try {
        const session = JSON.parse(raw) as SessionDTO
        this.session = session
      } catch {
        localStorage.removeItem('auth')
      }
    },
    clear() {
      this.session = null
      localStorage.removeItem('auth')
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.session?.access
    },
    profile(state) {
      return state.session?.admin ?? null
    },
  },
})

