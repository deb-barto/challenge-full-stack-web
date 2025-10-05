<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const store = useAuthStore()
const router = useRouter()
store.loadSession()

const profile = computed(() => store.profile)
const username = computed(() => profile.value?.username ?? 'unknown')
const email = computed(() => profile.value?.email ?? '')

if (!store.isAuthenticated) {
  router.replace({ name: 'login' })
}

function logout() {
  store.clear()
  router.push({ name: 'login' })
}
</script>

<template>
  <section>
    <h1>admin dashboard</h1>
    <p>hello, {{ username }}</p>
    <p v-if="email">email: {{ email }}</p>
    <button type="button" @click="logout">logout</button>
  </section>
</template>

