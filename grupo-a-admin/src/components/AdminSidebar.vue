<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

type Item = {
  label: string
  icon: string
  value: string
}

const drawer = ref(true)
const display = useDisplay()
const isMobile = computed(() => display.smAndDown.value)
const items = [
  { label: 'Início', icon: 'mdi-home-analytics', value: 'admin-home' },
  { label: 'Alunos', icon: 'mdi-account-multiple', value: 'students' },
  { label: 'Cursos', icon: 'mdi-book-open-variant', value: 'courses' },
  { label: 'Financeiro', icon: 'mdi-cash-multiple', value: 'finance' },
] satisfies readonly Item[]

const router = useRouter()
const fallbackRoute = items[0]?.value ?? 'admin-home'
const active = ref(router.currentRoute.value.name?.toString() ?? fallbackRoute)
function select(item: Item) {
  active.value = item.value
  router.push({ name: item.value })
  if (isMobile.value) {
    drawer.value = false
  }
}

watchEffect(() => {
  if (!isMobile.value) {
    drawer.value = true
  }
})
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    class="admin-sidebar"
    :permanent="!isMobile"
    :temporary="isMobile"
    :mobile-breakpoint="600"
    width="190"
    elevation="8"
  >
    <v-slide-y-transition mode="out-in">
      <v-list class="admin-sidebar__list" nav density="comfortable" mandatory :key="active">
        <v-list-item
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :active="active === item.value"
          class="admin-sidebar__item"
          @click="select(item)"
        >
          <template #prepend>
            <v-icon :icon="item.icon" />
          </template>
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-slide-y-transition>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">
.admin-sidebar {
  background: linear-gradient(180deg, #451e74 0%, #612a77 100%);
  color: #ffffff;

  :deep(.v-navigation-drawer__content) {
    padding-top: 1.5rem;
  }

  &__list {
    color: inherit;
  }

  &__item {
    border-radius: 14px;
    margin: 0.35rem 0.75rem;
    transition:
      transform 0.2s ease,
      background-color 0.2s ease,
      box-shadow 0.2s ease;

    &.v-list-item--active {
      background: rgba(255, 255, 255, 0.18);
      box-shadow: 0 12px 24px rgba(13, 39, 80, 0.3);
      transform: translateX(6px);
    }

    &:hover {
      background: rgba(255, 255, 255, 0.12);
    }

    :deep(.v-icon) {
      color: #f1faee;
    }
  }
}
</style>

