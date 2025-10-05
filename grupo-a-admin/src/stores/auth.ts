import { defineStore } from 'pinia'

type AdminProfile = {
  id: string
  username: string
  email: string
  createdAt: string
}

type Session = {
  access: string
  refresh: string
  admin: AdminProfile
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    session: null as Session | null,
  }),
  actions: {
    setSession(session: Session) {
      this.session = session
      localStorage.setItem('auth', JSON.stringify(session))
    },
    loadSession() {
      const raw = localStorage.getItem('auth')
      if (!raw) return
      try {
        const session = JSON.parse(raw) as Session
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

