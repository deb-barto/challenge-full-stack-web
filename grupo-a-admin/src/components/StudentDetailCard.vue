<script setup lang="ts">
import { computed } from 'vue'
import type { Student } from '../types/students'

const props = defineProps<{
  student: Student
  editing: boolean
  editName: string
  editEmail: string
  nameError: string | null
  emailError: string | null
  nameTouched: boolean
  emailTouched: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (event: 'toggle-edit'): void
  (event: 'update:name', value: string): void
  (event: 'update:email', value: string): void
  (event: 'blur-name'): void
  (event: 'blur-email'): void
}>()

const formattedCpf = computed(() => {
  const digits = props.student.cpf.replace(/\D/g, '')
  if (digits.length !== 11) return props.student.cpf
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
})

const createdAt = computed(() => new Date(props.student.createdAt).toLocaleString('pt-BR'))

const courseNames = computed(() => props.student.enrollments.map((enrollment) => enrollment.course.name))
</script>

<template>
  <v-card class="student-detail-card" elevation="8">
    <v-card-title class="student-detail-card__title">
      <v-icon icon="mdi-account-school" size="32" class="student-detail-card__icon" />
      <div class="student-detail-card__heading">
        <span v-if="!editing" class="student-detail-card__name">{{ student.name }}</span>
        <v-text-field
          v-else
          :model-value="editName"
          label="Nome"
          variant="underlined"
          density="comfortable"
          class="student-detail-card__name-input"
          :error="nameTouched && !!nameError"
          :error-messages="nameTouched && nameError ? [nameError] : []"
          :disabled="disabled"
          @update:model-value="(value) => emit('update:name', value)"
          @blur="emit('blur-name')"
        />
        <span class="student-detail-card__record">{{ student.academicRecord }}</span>
      </div>
      <v-btn
        variant="text"
        class="student-detail-card__edit-btn"
        color="primary"
        @click="emit('toggle-edit')"
      >
        <v-icon :icon="editing ? 'mdi-pencil-off' : 'mdi-pencil'" start />
        {{ editing ? 'Cancelar edição' : 'Editar' }}
      </v-btn>
    </v-card-title>

    <v-divider class="student-detail-card__divider" />

    <v-card-text class="student-detail-card__content">
      <div class="student-detail-card__row">
        <div class="student-detail-card__item">
          <span class="student-detail-card__label">CPF</span>
          <span class="student-detail-card__value">{{ formattedCpf }}</span>
        </div>
        <div class="student-detail-card__item">
          <span class="student-detail-card__label">Email</span>
          <template v-if="!editing">
            <span class="student-detail-card__value">{{ student.email || '—' }}</span>
          </template>
          <template v-else>
            <v-text-field
              :model-value="editEmail"
              variant="outlined"
              density="comfortable"
              class="student-detail-card__input"
              :error="emailTouched && !!emailError"
              :error-messages="emailTouched && emailError ? [emailError] : []"
              :disabled="disabled"
              @update:model-value="(value) => emit('update:email', value)"
              @blur="emit('blur-email')"
            />
          </template>
        </div>
      </div>

      <div class="student-detail-card__row">
        <div class="student-detail-card__item">
          <span class="student-detail-card__label">Turma</span>
          <span class="student-detail-card__value">{{ student.classGroup || '—' }}</span>
        </div>
        <div class="student-detail-card__item">
          <span class="student-detail-card__label">Criado em</span>
          <span class="student-detail-card__value">{{ createdAt }}</span>
        </div>
      </div>

      <div class="student-detail-card__list">
        <span class="student-detail-card__label">Cursos</span>
        <v-fade-transition group class="student-detail-card__chips">
          <v-chip
            v-for="name in courseNames"
            :key="name"
            class="student-detail-card__chip"
            color="primary"
            variant="elevated"
            size="small"
          >
            {{ name }}
          </v-chip>
        </v-fade-transition>
        <span v-if="!courseNames.length" class="student-detail-card__empty">Nenhum curso matriculado</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.student-detail-card {
  border-radius: 24px;
  background: #ffffff;
  overflow: hidden;
  &__title {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.75rem 2rem 1.25rem;
  }

  &__icon {
    color: #1d3557;
  }

  &__heading {
    display: flex;
    flex-direction: column;
  }

  &__name {
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #451e74;
  }

  &__record {
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    color: #457b9d;
  }

  &__edit-btn {
    margin-left: auto;
    text-transform: none;
    letter-spacing: 0.08em;
    font-weight: 600;
  }

  &__name-input {
    width: 100%;

    :deep(.v-field__outline) {
      border-radius: 0;
    }
  }

  &__divider {
    opacity: 0.2;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.75rem 2rem;
  }

  &__row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 1rem;
    background: #f5f6fa;
    border-radius: 16px;
    box-shadow: 0 8px 18px rgba(13, 39, 80, 0.08);
  }

  &__label {
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    color: #8d99ae;
  }

  &__value {
    font-size: 1rem;
    font-weight: 600;
    color: #451e74;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__chip {
    letter-spacing: 0.08em;
    font-weight: 600;
  }

  &__empty {
    font-size: 0.95rem;
    color: #8d99ae;
  }
}

@media (max-width: 960px) {
  .student-detail-card {
    &__content {
      padding: 1.5rem;
    }

    &__row {
      grid-template-columns: 1fr;
    }
  }
}
</style>


