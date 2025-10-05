<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
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
    max-width="420"
    persistent
    transition="dialog-fade-transition"
    @update:model-value="dialog = $event"
  >
    <v-card class="edit-confirm" elevation="10">
      <v-card-title class="edit-confirm__title">
        <v-icon icon="mdi-pencil" size="28" class="edit-confirm__icon" />
        confirmar atualização
      </v-card-title>
      <v-card-text class="edit-confirm__text">
        Deseja realmente salvar as alterações realizadas neste aluno?
      </v-card-text>
      <v-card-actions class="edit-confirm__actions">
        <v-btn
          variant="text"
          color="grey"
          class="edit-confirm__button edit-confirm__button--cancel"
          :disabled="loading"
          @click="close"
        >
          cancelar
        </v-btn>
        <v-btn
          color="primary"
          class="edit-confirm__button edit-confirm__button--confirm"
          :loading="loading"
          :disabled="loading"
          @click="confirm"
        >
          confirmar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.edit-confirm {
  border-radius: 20px;

  &__title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #451e74;
    padding-bottom: 0;
  }

  &__icon {
    color: #451e74;
  }

  &__text {
    padding-top: 1rem;
    font-size: 0.95rem;
    color: #4a4a4a;
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
    text-transform: none;

    &--cancel {
      color: #457b9d;
    }

    &--confirm {
      min-width: 140px;
    }
  }
}
</style>


