<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  studentName: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'confirm'): void
}>()

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

function close() {
  if (props.loading) return
  emit('update:modelValue', false)
}

function confirm() {
  emit('confirm')
}
</script>

<template>
  <v-dialog
    :model-value="dialog"
    persistent
    max-width="420"
    transition="dialog-fade-transition"
    @update:model-value="dialog = $event"
  >
    <v-card class="delete-modal" elevation="10">
      <v-card-title class="delete-modal__title">
        <v-icon icon="mdi-alert" size="28" class="delete-modal__icon" />
        confirmar exclusão
      </v-card-title>
      <v-card-text class="delete-modal__text">
        Tem certeza que deseja excluir o aluno <strong>{{ studentName }}</strong>? Esta ação não pode ser desfeita.
      </v-card-text>
      <v-card-actions class="delete-modal__actions">
        <v-btn
          variant="text"
          color="grey"
          class="delete-modal__button delete-modal__button--cancel"
          :disabled="loading"
          @click="close"
        >
          cancelar
        </v-btn>
        <v-btn
          color="error"
          class="delete-modal__button delete-modal__button--confirm"
          :loading="loading"
          :disabled="loading"
          @click="confirm"
        >
          excluir
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.delete-modal {
  border-radius: 20px;

  &__title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #e63946;
    padding-bottom: 0;
  }

  &__icon {
    color: #e63946;
  }

  &__text {
    padding-top: 1rem;
    font-size: 0.95rem;
    color: #424242;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem 1.5rem;
  }

  &__button {
    letter-spacing: 0.1em;
    font-weight: 600;

    &--cancel {
      color: #457b9d;
    }

    &--confirm {
      min-width: 120px;
    }
  }
}
</style>


