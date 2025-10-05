<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { isAxiosError } from 'axios'
import { useRouter } from 'vue-router'
import AdminHeader from '../components/AdminHeader.vue'
import AdminSidebar from '../components/AdminSidebar.vue'
import StudentCreateModal from '../components/StudentCreateModal.vue'
import { useStudentsStore } from '../stores/students'
import type { Student } from '../types/students'

const router = useRouter()
const store = useStudentsStore()
const search = ref('')
const createDialog = ref(false)
const initialError = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const headers = computed(() => ([
  { title: 'Nome', value: 'name' },
  { title: 'Registro Acadêmico', value: 'academicRecord' },
  { title: 'CPF', value: 'cpf' },
  { title: 'Email', value: 'email' },
  { title: 'Ações', value: 'actions', sortable: false, align: 'center' },
]))

onMounted(() => {
  console.debug('[StudentsView] mounted, fetching initial data')
  store.fetch().catch((error) => {
    console.error('[StudentsView] initial fetch error', error)
    initialError.value = isAxiosError(error)
      ? error.response?.data?.message ?? error.message
      : error instanceof Error
        ? error.message
        : 'ocorreu um erro inesperado'
  })
})

async function handleSearch() {
  console.debug('[StudentsView] handleSearch', { search: search.value })
  await store.fetch(1, store.limit, search.value || undefined)
}

async function changePage(page: number) {
  console.debug('[StudentsView] changePage', { page })
  await store.fetch(page, store.limit, search.value || undefined)
}

function openCreateModal() {
  createDialog.value = true
}

function handleCreated() {
  createDialog.value = false
}

function goToDetail(id: string) {
  console.debug('[StudentsView] navigate to detail', { id })
  router.push({ name: 'student-detail', params: { id } })
}

function handleStudentCreated(student: Student) {
  createDialog.value = false
  successMessage.value = `Aluno ${student.name} cadastrado com sucesso!`
  setTimeout(() => {
    successMessage.value = null
  }, 4000)
}
</script>

<template>
  <v-app>
    <AdminHeader />
    <div class="students">
      <AdminSidebar />
      <v-main class="students__main">
        <v-container fluid class="students__container">
          <v-slide-y-transition>
            <v-alert
              v-if="successMessage"
              key="students-success"
              type="success"
              variant="tonal"
              border="start"
              class="students__success"
            >
              {{ successMessage }}
            </v-alert>
          </v-slide-y-transition>
          <v-row>
            <v-col cols="12">
              <v-card elevation="6" class="students__card">
                <v-card-title class="students__card-title">Central de Alunos</v-card-title>
                <v-card-subtitle>Gerenciamento de cadastros de alunos</v-card-subtitle>
                <v-card-text>
                  <div class="students__actions">
                    <v-text-field
                      v-model="search"
                      label="buscar aluno"
                      prepend-inner-icon="mdi-magnify"
                      variant="outlined"
                      density="comfortable"
                      class="students__search"
                      @keyup.enter="handleSearch"
                    />
                    <v-btn color="primary" class="students__create" @click="openCreateModal">
                      Cadastrar aluno
                    </v-btn>
                  </div>
                  <v-slide-y-transition mode="out-in">
                    <v-alert
                      v-if="initialError"
                      key="students-error"
                      type="error"
                      variant="tonal"
                      border="start"
                      class="students__info"
                    >
                      {{ initialError }}
                    </v-alert>
                  </v-slide-y-transition>
                  <v-slide-y-transition mode="out-in">
                    <v-data-table
                      key="students-table"
                      :headers="headers"
                      :items="store.items"
                      :items-per-page="store.limit"
                      v-model:page="store.page"
                      :loading="store.loading"
                      class="students__table"
                      item-value="id"
                    >
                      <template #item.actions="{ item }">
                        <v-btn
                          variant="text"
                          color="primary"
                          class="students__detail-btn"
                          @click="goToDetail(item.id)"
                        >
                          Detalhes
                          <v-icon icon="mdi-arrow-right" end />
                        </v-btn>
                      </template>
                      <template #bottom>
                        <v-pagination
                          :length="store.pages"
                          v-model="store.page"
                          @update:model-value="changePage"
                        />
                      </template>
                    </v-data-table>
                  </v-slide-y-transition>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <StudentCreateModal v-model="createDialog" @created="handleStudentCreated" />
      </v-main>
    </div>
  </v-app>
</template>

<style scoped lang="scss">
.students {
  display: flex;
  min-height: calc(100vh - 64px);

  &__main {
    flex: 1;
    height: 100vh;
    background: #f5f6fa;
  }

  &__container {
    padding: 2.5rem;
  }

  &__card {
    border-radius: 24px;
    padding: 2rem;
  }

  &__card-title {
    letter-spacing: 0.08em;
    font-weight: 700;
    color: #451e74;
  }

  &__table {
    margin-top: 1rem;
    border-radius: 16px;
    box-shadow: 0 2px 4px rgba(13, 39, 80, 0.12);
  }

  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  &__search {
    flex: 2;
    max-width: 30%;
  }

  &__create {
    align-self: flex-start;
    min-width: 200px;
    color: #451e74 !important;
    background-color: #ffffff !important;
    border: #8139da 1px solid !important;
    text-transform: none;
  }

  &__info {
    margin-bottom: 1rem;
  }

  &__detail-btn {
    letter-spacing: 0.05em;
    font-weight: 600;
    color: #451e74 !important;
    text-transform: none;
  }

  &__success {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 960px) {
  .students {
    flex-direction: column;

    &__container {
      padding: 1.5rem;
    }
  }
}
</style>

