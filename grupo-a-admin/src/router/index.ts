import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AdminHome from '../views/AdminHome.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    { path: '/', name: 'admin-home', component: AdminHome },
  ],
})

router.beforeEach((to) => {
  const store = useAuthStore()
  store.loadSession()
  if (to.meta.public) {
    if (store.isAuthenticated) {
      return { name: 'admin-home' }
    }
    return true
  }
  if (!store.isAuthenticated) {
    return { name: 'login', query: { next: to.fullPath } }
  }
  return true
})

export default router
