<template>
  <v-tooltip v-if="canCancel(demande)" text="Supprimer">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props"
             icon="mdi-delete"
             variant="text"
             @click="dialog = true">
      </v-btn>
    </template>
  </v-tooltip>
  <dialog-suppression v-model="dialog" :demande="demande" @supp="emits('clicked')" @on-error="throwError">
  </dialog-suppression>
</template>
<script setup>
import { ref } from 'vue';
import DialogSuppression from '@/components/Dialog/DialogSuppression.vue';

const emits = defineEmits(['clicked', 'onError']);
const props = defineProps({
  demande: {
    required: true,
  }
});
const dialog = ref(false);

function canCancel(item) {
  return item.etatDemande !== 'Terminé' && item.etatDemande !== 'En cours de traitement' && item.etatDemande !== 'En attente';
}

function throwError(error) {
  emits('onError', error);
}
</script>
