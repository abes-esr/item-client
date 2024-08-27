<template>
  <v-card elevation="0">
    <v-card-title style="background-color: #295494; color: white" class="d-flex justify-space-between">
      <span><slot></slot></span>
      <v-btn depressed variant="text" @click="deleted()" prepend-icon="mdi-delete">Supprimer</v-btn>
    </v-card-title>
    <v-card-text class="pt-5">
      <v-file-input
        :loading="isLoading"
        color="info"
        truncate-length=75
        accept=".csv,.txt"
        :rules="rules"
        show-size
        outlined
        prepend-icon="mdi-paperclip"
        type="file"
        aria-label="Dépôt du fichier"
        v-model="fileCharged"
        ref="fileInput"
        :label="label"
      >
      </v-file-input>
    </v-card-text>
  </v-card>
</template>
<script setup>
import {computed, ref} from 'vue'

const fileCharged = defineModel();
const props = defineProps(  {isLoading: { type: Boolean}, typeFile: { type: String}})
const emits = defineEmits(['deleted']);

const isValidFile = ref(false)
const label = computed(() => {
  if (props.typeFile === 'PPN'){
    return 'Cliquez pour charger votre liste de PPN (Fichier PPN sur une colonne, format .txt ou .csv obligatoire)';
  } else if (props.typeFile === 'EPN'){
    return 'Cliquez pour charger votre liste d’EPN (Fichier EPN sur une colonne, format .txt ou .csv obligatoire)';
  } else {
    return 'Cliquez pour charger votre fichier complété (format .txt ou .csv obligatoire)';
  }
})
const rules = ref([
  value => {
    if(!value[0]) {
      isValidFile.value = false;
      return true;
    }
    if((value[0].type === undefined) || (value[0].type === 'text/csv') || (value[0].type === 'application/vnd.ms-excel') || (value[0].type === 'text/plain')){
      isValidFile.value = true;
      return true;
    }
    isValidFile.value = false;
    return 'Le fichier chargé n\'est pas dans un format autorisé (.txt ou .csv)';
  }
])

function deleted() {
  emits('deleted');
}
</script>
