<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { LoginDTO } from '../types/auth'

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
    const payload: LoginDTO = { username: form.username, password: form.password }
    const session = await store.login(payload)
    router.push({ name: 'admin-home' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'login failed'
    error.value = message
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

