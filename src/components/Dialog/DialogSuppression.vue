<template>
  <v-dialog v-model="dialog" width="500">
    <v-skeleton-loader
      :loading="isLoading"
      class="mx-auto"
      elevation="12"
      width="500"
      type="table-heading, list-item-two-line, table-tfoot"
    >
      <v-card>
        <v-card-title>Suppression</v-card-title>
        <v-divider></v-divider>
        <v-card-text>Êtes-vous certain de vouloir supprimer définitivement cette demande ?</v-card-text>
        <v-card-actions>

          <v-container class="d-flex justify-space-between">
            <v-btn @click="cancel()">Annuler</v-btn>
            <v-btn @click="confirm()">Confirmer</v-btn>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-skeleton-loader>
  </v-dialog>
</template>
<script setup>
import itemService from '@/service/DemandesService';
import router from '@/router';
import { ref } from 'vue';

const dialog = defineModel();
const emits = defineEmits(['supp'])
const props = defineProps({
  returnToAccueil: {
    required: false,
    type: Boolean,
  },
  demande: {
    required: true,
    type: Object
  }
})
const isLoading = ref(false);

function confirm() {
  isLoading.value = true;
  itemService.deleteDemande(props.demande.id, props.demande.type)
    .then(()=>{
      if(props.returnToAccueil){
        router.push('/accueil');
      }
      emits('supp');
    }).finally(() => {
    isLoading.value = false;
    dialog.value = false;
  })
}

function cancel() {
  dialog.value = false;
}

</script>

