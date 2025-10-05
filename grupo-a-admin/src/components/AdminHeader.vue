<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const store = useAuthStore()
const router = useRouter()

async function logout() {
  store.clear()
  router.push({ name: 'login' })
}
</script>

<template>
  <v-app-bar flat class="admin-header">
    <div class="admin-header__brand">
      <v-icon icon="mdi-school" size="32" class="admin-header__logo" />
      <span class="admin-header__title">grupo a painel</span>
    </div>

    <v-spacer />

    <v-btn  variant="outlined" class="admin-header__logout" @click="logout">
      <v-icon icon="mdi-logout" start />
      sair
    </v-btn>
  </v-app-bar>
</template>

<style scoped lang="scss">
.admin-header {
  background: #ffffff !important;
  box-shadow: 0 12px 24px rgba(13, 39, 80, 0.08);

  &__brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    justify-content: flex-end;
    width: 200px;
  }

  &__logo {
    color: #451e74;

  }

  &__title {
    font-weight: 700;
    font-size: 1.1rem;
    letter-spacing: 0.08em;
    color: #451e74;
  }

  &__logout {
    border-radius: 999px;
    letter-spacing: 0.08em;
    font-weight: 600;
    color: #451e74 !important;
    left: -20px;
  }
}
</style>

