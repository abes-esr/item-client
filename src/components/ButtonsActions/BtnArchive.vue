<template>
  <v-tooltip v-if="canArchive(demande)" text="Archiver">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props"
             variant="text"
             icon="mdi-archive"
             color="archived"
             @click="archiverDemande(demande)"
             aria-label="Archiver"></v-btn>
    </template>
  </v-tooltip>
</template>
<script setup>
import itemService from '@/service/ItemService';

const emits = defineEmits(['clicked', 'onError']);
const props = defineProps({
  demande: {
    required: true
  }
});

//Action d'archivage ou suppression selon état de la demande dans le TDB
function canArchive(item) {
  return item.etatDemande === 'Terminé';
}

//Archivage d'une demande
function archiverDemande(item) {
  itemService.archiverDemande(item.type, item.id)
      .then(() => {
        emits('clicked');
      })
      .catch(error => {
        emits('onError', error);
      });
}

</script>
