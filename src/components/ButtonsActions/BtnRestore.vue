<template>
  <div v-bind="$attrs">
  <v-tooltip v-if="demande.etatDemande === 'Archivé'" text="Restaurer">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props"
             variant="text"
             color="green"
             icon="mdi-package-up"
             @click="restaurerDemande(demande)"></v-btn>
    </template>
  </v-tooltip>
  </div>
</template>
<script setup>
import itemService from '@/service/ItemService';

defineOptions({
  inheritAttrs: false
});

const emits = defineEmits(['clicked', 'onError']);
const props = defineProps({
  demande: {
    required: true
  }
});

function restaurerDemande(item) {
  itemService.restaurerDemande(item.id, item.type)
    .then(() => {
      emits('clicked');
    })
    .catch(error => {
      emits('onError', error);
    });
}

</script>
