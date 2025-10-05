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
    await store.login(payload)
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
  <v-app>
    <v-main class="login">
      <section class="login__panel">
        <header class="login__header">
          <v-icon icon="mdi-shield-account" class="login__icon" />
          <h1 class="login__title">Admin area</h1>
          <p class="login__subtitle">Entre com suas credenciais para continuar</p>
        </header>

        <v-form class="login__form" @submit.prevent="submit">
          <v-text-field
            v-model="form.username"
            label="usuário"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            :disabled="loading"
            density="comfortable"
            class="login__field login__field--username"
            autocomplete="username"
            required
          />

          <v-text-field
            v-model="form.password"
            label="senha"
            prepend-inner-icon="mdi-lock"
            type="password"
            variant="outlined"
            :disabled="loading"
            density="comfortable"
            class="login__field login__field--password"
            autocomplete="current-password"
            required
          />

          <v-btn
            type="submit"
            color="primary"
            size="large"
            class="login__submit"
            :loading="loading"
            block
          >
            entrar
          </v-btn>
        </v-form>

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="login__alert"
          border="start"
        >
          {{ error }}
        </v-alert>
      </section>
    </v-main>
  </v-app>
</template>

<style scoped lang="scss">
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg,rgb(78, 146, 242), #5f459d);

  &__panel {
    width: min(440px, 92vw);
    padding: 2.5rem;
    border-radius: 24px;
    background-color: #ffffff;
    box-shadow:
      0 30px 60px rgba(13, 39, 80, 0.28),
      0 18px 28px rgba(13, 39, 80, 0.18);
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  &__header {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  &__icon {
    font-size: 3.5rem;
    color: #451e74;
  }

  &__title {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    color: #1d3557;
    letter-spacing: 0.06em;
  }

  &__subtitle {
    margin: 0;
    font-size: 0.95rem;
    color: rgba(29, 53, 87, 0.68);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  &__field {
    &--username,
    &--password {
      :deep(.v-field__outline) {
        border-radius: 16px;
      }
    }
  }

  &__submit {
    border-radius: 16px;
    font-weight: 600;
    letter-spacing: 0.08em;
    box-shadow: 0 18px 30px rgba(69, 123, 157, 0.35);
  }

  &__alert {
    border-radius: 16px;
  }
}

@media (max-width: 640px) {
  .login {
    padding: 2rem 1rem;

    &__panel {
      padding: 2rem 1.5rem;
      border-radius: 20px;
    }

    &__title {
      font-size: 1.5rem;
    }

    &__subtitle {
      font-size: 0.85rem;
    }
  }
}
</style>

