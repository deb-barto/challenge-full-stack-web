<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const form = reactive({ username: '', password: '' })
const loading = ref(false)
const error = ref<string | null>(null)
const store = useAuthStore()
const router = useRouter()

store.loadSession()
if (store.isAuthenticated) {
  router.replace({ name: 'admin-home' })
}

async function submit() {
  error.value = null
  loading.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: form.username, password: form.password }),
    })

    if (!res.ok) {
      throw new Error('invalid credentials')
    }

    const session = await res.json()
    store.setSession(session)
    router.push({ name: 'admin-home' })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main>
    <h1>admin login</h1>
    <form @submit.prevent="submit">
      <label>
        username
        <input v-model="form.username" type="text" autocomplete="username" required />
      </label>
      <label>
        password
        <input v-model="form.password" type="password" autocomplete="current-password" required />
      </label>
      <button type="submit" :disabled="loading">login</button>
    </form>
    <p v-if="error" style="color: red">{{ error }}</p>
  </main>
</template>

