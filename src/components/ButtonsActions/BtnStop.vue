<template>
  <div v-bind="$attrs">
  <v-tooltip v-if="canStop(demande)" text="Annuler">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props"
             icon="mdi-stop"
             variant="text"
             color="red"
             @click="dialog = true">
      </v-btn>
    </template>
  </v-tooltip>
  <dialog-confirmation-stop v-model="dialog" :id="demande.id" @clicked="emits('clicked')" @on-error="throwError">
  </dialog-confirmation-stop>
  </div>
</template>
<script setup>
import DialogConfirmationStop from '@/components/Dialog/DialogConfirmationStop.vue';
import { ref } from 'vue';

defineOptions({
  inheritAttrs: false
});

const emits = defineEmits(['clicked', 'onError']);
const props = defineProps({
  demande: {
    required: true
  }
});
const dialog = ref(false);

function canStop(item) {
  return item.etatDemande === 'En cours de traitement' || item.etatDemande === 'En attente';
}

function throwError(error) {
  emits('onError', error);
}
</script>
