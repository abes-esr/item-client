<template>
  <v-card class="elevation-12">
    <v-card-title style="background-color: #295494; color: white">
      <span>Charger le fichier du taux de recouvrement</span>
    </v-card-title>
    <v-card-text class="pt-5">
      <v-file-input
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
        label="Fichier de recouvrement"
      >
      </v-file-input>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="!isValidFile" @click="validate">Valider</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref } from 'vue';

const emits = defineEmits(["validate"])

const fileCharged = ref();
const isValidFile = ref(false)
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

function validate(){
  emits('validate', fileCharged.value);
}
</script>
