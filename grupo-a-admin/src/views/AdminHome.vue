<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AdminHeader from '../components/AdminHeader.vue'
import AdminSidebar from '../components/AdminSidebar.vue'

const store = useAuthStore()
const router = useRouter()
store.loadSession()

const profile = computed(() => store.profile)
const username = computed(() => profile.value?.username ?? 'unknown')
const email = computed(() => profile.value?.email ?? '')

if (!store.isAuthenticated) {
  router.replace({ name: 'login' })
}

</script>

<template>
  <v-app>
    <AdminHeader />
    <div class="dashboard">
      <AdminSidebar />
      <v-main class="dashboard__main">
        <v-container class="dashboard__container" fluid>
          <v-card class="dashboard__card" elevation="6">
            <v-card-title class="dashboard__title">Bem-vindo, {{ username }}</v-card-title>
            <v-card-text class="dashboard__content">
              <v-img
                class="dashboard__image"
                src="../assets/admin-welcome.svg"
                alt="Boas-vindas ao painel"
              />
              <p class="dashboard__message">Use o menu para acessar os módulos administrativos.</p>
            </v-card-text>
          </v-card>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<style scoped lang="scss">
.dashboard {
  display: flex;
  height: 100vh;
  &__main {
    flex: 1;
    background: #f5f6fa;
  }

  &__container {
    padding-top: 3rem;
    display: flex;
    justify-content: center;
  }

  &__card {
    width: min(720px, 90vw);
    border-radius: 24px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    color:  #451e74;;
  }

  &__subtitle {
    font-size: 1rem;
    color: rgb(42, 42, 42);
  }

  &__content {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 35vw;
    height: 40vh;
    font-size: 1rem;
    color:  #451e74;
  }

  &__image {
    background-color: none;
    height: 70%;
    width: 100%;
    }

  &__message {
    letter-spacing: 0.08em;
    font-weight: 600;
  }
}
</style>

