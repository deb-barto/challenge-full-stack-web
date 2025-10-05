<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { isAxiosError } from 'axios'
import { useStudentsStore } from '../stores/students'
import type { CreateStudentDTO, Student } from '../types/students'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'created', student: Student): void
}>()

const store = useStudentsStore()

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const loading = ref(false)
const submitError = ref<string | null>(null)
const touched = reactive({
  name: false,
  cpf: false,
  email: false,
})

const form = reactive({
  name: '',
  cpf: '',
  email: '',
})

function resetForm() {
  Object.assign(form, { name: '', cpf: '', email: '' })
  submitError.value = null
  touched.name = false
  touched.cpf = false
  touched.email = false
}

watch(dialog, (isOpen) => {
  if (!isOpen) {
    console.debug('[StudentCreateModal] dialog closed')
    resetForm()
  } else {
    console.debug('[StudentCreateModal] dialog opened')
  }
})

function formatCpf(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  const parts = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 9),
    digits.slice(9, 11),
  ].filter(Boolean)

  if (parts.length <= 1) return digits
  if (parts.length === 2) return `${parts[0]}.${parts[1]}`.replace(/\.$/, '')
  if (parts.length === 3) return `${parts[0]}.${parts[1]}.${parts[2]}`.replace(/\.$/, '')
  return `${parts[0]}.${parts[1]}.${parts[2]}-${parts[3]}`.replace(/-$/, '')
}

function onCpfInput(value: string) {
  const formatted = formatCpf(value)
  if (formatted !== form.cpf) {
    form.cpf = formatted
  }
}

const cpfDigits = computed(() => form.cpf.replace(/\D/g, ''))

const nameValidation = computed(() => {
  const value = form.name.trim()
  if (!value) return 'Informe o nome completo'
  const parts = value.split(/\s+/).filter(Boolean)
  if (parts.length < 2) return 'Informe nome e sobrenome'
  return null
})

const cpfValidation = computed(() => {
  if (cpfDigits.value.length !== 11) return 'CPF deve conter 11 dígitos'
  return null
})

const emailValidation = computed(() => {
  const value = form.email.trim()
  if (!value) return 'Informe o email'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return 'Email inválido'
  if (!value.toLowerCase().endsWith('.com')) return 'Email deve terminar com .com'
  return null
})

const nameError = computed(() => (touched.name ? nameValidation.value : null))
const cpfError = computed(() => (touched.cpf ? cpfValidation.value : null))
const emailError = computed(() => (touched.email ? emailValidation.value : null))

const isValid = computed(() => !nameValidation.value && !cpfValidation.value && !emailValidation.value)

function onBlur(field: keyof typeof touched) {
  touched[field] = true
}

function extractErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const payload = error.response?.data as { message?: string }
    return payload?.message || error.message || 'ocorreu um erro inesperado'
  }
  if (error instanceof Error) return error.message
  return 'ocorreu um erro inesperado'
}

async function submit() {
  touched.name = true
  touched.cpf = true
  touched.email = true
  if (!isValid.value) return
  loading.value = true
  submitError.value = null
  const payload: CreateStudentDTO = {
    name: form.name.trim(),
    cpf: cpfDigits.value,
    email: form.email.trim(),
  }
  console.debug('[StudentCreateModal] submit payload', payload)
  try {
    const created = await store.create(payload) as Student
    console.debug('[StudentCreateModal] submit success')
    emit('created', created)
    emit('update:modelValue', false)
    resetForm()
  } catch (error) {
    submitError.value = extractErrorMessage(error)
    console.error('[StudentCreateModal] submit error', error)
  } finally {
    loading.value = false
  }
}

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog
    :model-value="dialog"
    max-width="560"
    persistent
    transition="dialog-bottom-transition"
    @update:model-value="dialog = $event"
  >
    <v-card>
      <v-card-title class="modal__title">
        Cadastrar novo aluno
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="close" />
      </v-card-title>
      <v-card-subtitle class="modal__subtitle">
        Preencha os dados para adicionar um novo aluno
      </v-card-subtitle>
      <v-card-text>
        <v-alert v-if="submitError" type="error" variant="tonal" border="start" class="modal__alert">
          {{ submitError }}
        </v-alert>

        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="form.name"
            class="modal__input"
            label="Nome completo"
            variant="outlined"
            density="comfortable"
            :error="!!nameError"
            :error-messages="nameError ? [nameError] : []"
            @blur="onBlur('name')"
          />

          <v-text-field
            :model-value="form.cpf"
            class="modal__input"
            label="CPF"
            variant="outlined"
            density="comfortable"
            inputmode="numeric"
            maxlength="14"
            :error="!!cpfError"
            :error-messages="cpfError ? [cpfError] : []"
            @update:model-value="onCpfInput"
            @blur="onBlur('CPF')"
          />

          <v-text-field
            v-model="form.email"
            class="modal__input"
            label="e-mail"
            variant="outlined"
            density="comfortable"
            :error="!!emailError"
            :error-messages="emailError ? [emailError] : []"
            @blur="onBlur('email')"
          />

          <v-btn
            type="submit"
            color="primary"
            block
            class="modal__submit"
            :loading="loading"
            :disabled="loading || !isValid"
          >
            Cadastrar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.modal {
  &__title {
    display: flex;
    align-items: center;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  &__subtitle {
    text-transform: none;
    letter-spacing: normal;
    margin-bottom: 1rem;
  }

  &__alert {
    margin-bottom: 3rem !important;
  }

  &__submit {
    margin-top: 1rem;
    border-radius: 16px;
    letter-spacing: 0.08em;
    font-weight: 600;
    background-color: #451e74 !important;
    color: #ffffff !important;
    text-transform: none;
  }
  &__input {
    margin-bottom: 30px;
    color: #451e74 !important;
  }
}
</style>


