<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title>Confirmation</v-card-title>
      <v-card-text>
        Voulez vous vraiment stopper le traitement sur la demande N°{{ id }} ?
      </v-card-text>
      <v-card-actions>
        <v-btn @click="dialog=false">Refuser</v-btn>
        <v-btn @click="stopDemande">Confirmer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import itemService from '@/service/ItemService';

const emits = defineEmits(['clicked', 'onError']);
const dialog = defineModel();
const props = defineProps({
  id: {
    required: true,
    type: Number
  }
});

function stopDemande() {
  itemService.stopDemande(props.id)
    .catch(err => {
      emits('onError', err);
    })
    .finally(() => {
      dialog.value = false;
      emits('clicked');
    });
}
</script>
