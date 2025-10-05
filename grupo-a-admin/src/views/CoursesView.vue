<script setup lang="ts">
import AdminHeader from '../components/AdminHeader.vue'
import AdminSidebar from '../components/AdminSidebar.vue'
</script>

<template>
  <v-app>
    <AdminHeader />
    <div class="courses">
      <AdminSidebar />
      <v-main class="courses__main">
        <v-container fluid class="courses__container">
          <v-slide-y-transition mode="out-in">
            <v-card key="courses-card" class="courses__card" elevation="6">
              <v-card-title class="courses__title">cursos</v-card-title>
              <v-card-text class="courses__content">
                <v-icon icon="mdi-book-open-variant" size="42" class="courses__icon" />
                <p>cursos</p>
              </v-card-text>
            </v-card>
          </v-slide-y-transition>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<style scoped lang="scss">
.courses {
  display: flex;
  min-height: calc(100vh - 64px);

  &__main {
    flex: 1;
    height: 100vh;
    background: linear-gradient(135deg, #f5f6fa 0%, #edf2f4 100%);
  }

  &__container {
    padding: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__card {
    width: min(560px, 90vw);
    border-radius: 24px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #451e74;
    letter-spacing: 0.08em;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    font-size: 1.25rem;
    letter-spacing: 0.1em;
    color: #457b9d;
  }

  &__icon {
    color: #451e74;
  }
}

@media (max-width: 960px) {
  .courses {
    flex-direction: column;

    &__container {
      padding: 2rem;
    }
  }
}
</style>


