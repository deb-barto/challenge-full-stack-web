<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import AdminHeader from '../components/AdminHeader.vue'
import AdminSidebar from '../components/AdminSidebar.vue'
import StudentDetailCard from '../components/StudentDetailCard.vue'
import StudentDeleteConfirmModal from '../components/StudentDeleteConfirmModal.vue'
import StudentEditConfirmModal from '../components/StudentEditConfirmModal.vue'
import { useStudentsStore } from '../stores/students'

const router = useRouter()
const route = useRoute()
const store = useStudentsStore()

const deleting = ref(false)
const confirmDialog = ref(false)
const editConfirmDialog = ref(false)
const errorMessage = ref<string | null>(null)
const updateError = ref<string | null>(null)
const updateSuccess = ref<string | null>(null)
const updating = ref(false)
const editing = ref(false)

const editForm = reactive({
  name: '',
  email: '',
})

const touched = reactive({
  name: false,
  email: false,
})

const studentId = computed(() => route.params.id as string)

const student = computed(() => store.current)

async function loadStudent(id: string) {
  errorMessage.value = null
  try {
    await store.fetchById(id)
  } catch (error) {
    const message = isAxiosError(error)
      ? error.response?.data?.message ?? error.message
      : error instanceof Error
        ? error.message
        : 'ocorreu um erro inesperado'
    errorMessage.value = message
  }
}

onMounted(() => {
  loadStudent(studentId.value)
})

watch(studentId, (id) => {
  if (id) loadStudent(id)
})

watch(student, (value) => {
  if (!value) return
  editForm.name = value.name
  editForm.email = value.email ?? ''
  touched.name = false
  touched.email = false
  editing.value = false
})

function goBack() {
  router.push({ name: 'students' })
}

function openConfirm() {
  confirmDialog.value = true
}

async function confirmDelete() {
  if (!student.value) return
  deleting.value = true
  errorMessage.value = null
  try {
    await store.remove(student.value.id)
    confirmDialog.value = false
    goBack()
  } catch (error) {
    const message = isAxiosError(error)
      ? error.response?.data?.message ?? error.message
      : error instanceof Error
        ? error.message
        : 'ocorreu um erro inesperado'
    errorMessage.value = message
  } finally {
    deleting.value = false
  }
}

const isLoading = computed(() => store.loading && !student.value)

const nameError = computed(() => {
  const value = editForm.name.trim()
  if (!value) return 'Informe o nome completo'
  if (value.split(/\s+/).filter(Boolean).length < 2) return 'Informe nome e sobrenome'
  return null
})

const emailError = computed(() => {
  const value = editForm.email.trim()
  if (!value) return null
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return 'E-mail inválido'
  return null
})

const isValid = computed(() => !nameError.value && !emailError.value)

function markTouched(field: keyof typeof touched) {
  touched[field] = true
}

function startEdit() {
  if (!student.value) return
  editing.value = true
  updateError.value = null
  updateSuccess.value = null
  touched.name = false
  touched.email = false
}

function cancelEdit() {
  if (!student.value) return
  editing.value = false
  editForm.name = student.value.name
  editForm.email = student.value.email ?? ''
  touched.name = false
  touched.email = false
  updateError.value = null
}

function requestUpdate() {
  if (!student.value) return
  touched.name = true
  touched.email = true
  if (!isValid.value) return
  editConfirmDialog.value = true
}

async function confirmUpdate() {
  if (!student.value) return
  updating.value = true
  updateError.value = null
  try {
    const payload = {
      name: editForm.name.trim(),
      email: editForm.email.trim() || undefined,
    }
    const updated = await store.update(student.value.id, payload)
    updateSuccess.value = `Dados de ${updated.name} atualizados com sucesso!`
    editing.value = false
    editForm.name = updated.name
    editForm.email = updated.email ?? ''
    touched.name = false
    touched.email = false
    setTimeout(() => {
      updateSuccess.value = null
    }, 4000)
  } catch (error) {
    updateSuccess.value = null
    updateError.value = isAxiosError(error)
      ? error.response?.data?.message ?? error.message
      : error instanceof Error
        ? error.message
        : 'ocorreu um erro inesperado'
  } finally {
    updating.value = false
    editConfirmDialog.value = false
  }
}
</script>

<template>
  <v-app>
    <AdminHeader />
    <div class="student-detail">
      <AdminSidebar />
      <v-main class="student-detail__main">
        <v-container fluid class="student-detail__container">
          <v-btn variant="text" class="student-detail__back" @click="goBack">
            <v-icon icon="mdi-arrow-left" start />
            Voltar para alunos
          </v-btn>

          <v-slide-y-transition mode="out-in">
            <v-alert
              v-if="errorMessage"
              key="detail-error"
              type="error"
              variant="tonal"
              border="start"
              class="student-detail__alert"
            >
              {{ errorMessage }}
            </v-alert>
          </v-slide-y-transition>

          <v-skeleton-loader
            v-if="isLoading"
            type="card, actions"
            class="student-detail__skeleton"
          />

          <v-fade-transition>
            <div v-if="student" key="detail-card" class="student-detail__content">
              <StudentDetailCard
                :student="student"
                :editing="editing"
                :edit-name="editForm.name"
                :edit-email="editForm.email"
                :name-error="nameError"
                :email-error="emailError"
                :name-touched="touched.name"
                :email-touched="touched.email"
                :disabled="updating"
                @toggle-edit="editing ? cancelEdit() : startEdit()"
                @update:name="(value: string) => { editForm.name = value }"
                @update:email="(value: string) => { editForm.email = value }"
                @blur-name="markTouched('name')"
                @blur-email="markTouched('email')"
              />
              <v-slide-y-transition>
                <v-alert
                  v-if="updateError"
                  key="detail-update-error"
                  type="error"
                  variant="tonal"
                  border="start"
                  class="student-detail__edit-alert"
                >
                  {{ updateError }}
                </v-alert>
              </v-slide-y-transition>
              <v-slide-y-transition>
                <v-alert
                  v-if="updateSuccess"
                  key="detail-update-success"
                  type="success"
                  variant="tonal"
                  border="start"
                  class="student-detail__edit-alert"
                >
                  {{ updateSuccess }}
                </v-alert>
              </v-slide-y-transition>
              <div class="student-detail__actions">
                <div class="student-detail__actions-group">
                  <v-btn
                    color="error"
                    variant="tonal"
                    class="student-detail__delete"
                    @click="openConfirm"
                  >
                    <v-icon icon="mdi-trash-can-outline" start />
                    Excluir aluno
                  </v-btn>
                  <div class="student-detail__save-wrapper">
                    <v-btn
                      class="student-detail__edit-save"
                      :loading="updating"
                      :disabled="!editing || updating || !isValid"
                      @click="requestUpdate"
                    >
                      Salvar alterações
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </v-fade-transition>
        </v-container>
      </v-main>
    </div>

    <StudentDeleteConfirmModal
      v-model="confirmDialog"
      :student-name="student?.name ?? ''"
      :loading="deleting"
      @confirm="confirmDelete"
    />
    <StudentEditConfirmModal
      v-model="editConfirmDialog"
      :loading="updating"
      @confirm="confirmUpdate"
    />
  </v-app>
</template>

<style scoped lang="scss">
.student-detail {
  display: flex;
  min-height: calc(100vh - 64px);

  &__main {
    flex: 1;
    height: 100vh;
    background: linear-gradient(135deg, #f5f6fa 0%, #edf2f4 100%);
  }

  &__container {
    padding: 2.5rem;
  }

  &__back {
    letter-spacing: 0.08em;
    font-weight: 600;
    color: #68459d;
    margin-bottom: 1.5rem;
    text-transform: none;
  }

  &__alert {
    margin-bottom: 1.5rem;
  }

  &__skeleton {
    border-radius: 24px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    animation: fade-in 0.4s ease;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  &__delete {
    letter-spacing: 0.08em;
    font-weight: 500;
    text-transform: none;
  }

  &__actions-group {
    display: flex;
    gap: 1rem;
    width: 100%;
    justify-content: center;
    justify-content: space-between;
    align-items: flex-end;
  }

  &__edit-toggle {
    letter-spacing: 0.08em;
    font-weight: 500;
    text-transform: none;
  }

  &__edit {
    border-radius: 20px;
    padding: 1.5rem 2rem;
  }

  &__edit-title {
    font-weight: 700;
    letter-spacing: 0.06em;
    color: #451e74;
  }

  &__edit-content {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding-top: 0.5rem;
  }

  &__input {
    :deep(.v-field__outline) {
      border-radius: 14px;
    }
  }

  &__edit-save {
    min-width: 180px;
    letter-spacing: 0.08em;
    font-weight: 400;
    text-transform: none;
    color: #ffffff;
    background-color: #451e74;
  }

  &__save-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 960px) {
  .student-detail {
    flex-direction: column;

    &__container {
      padding: 1.5rem;
    }

    &__actions {
      justify-content: center;
    }

    &__delete {
      width: 100%;
    }

    &__edit {
      padding: 1.25rem;
    }

    &__edit-save {
      width: 100%;
    }

    &__save-wrapper {
      justify-content: center;
    }
  }
}
</style>


