<template>
  <v-card elevation="1">
    <v-card-title style="background-color: #295494; color: white" >
      <span>Choix du type d'exemplarisation</span>
    </v-card-title>
    <v-card-text class="pa-0 ma-0">
      <div class="btn-perso elevation-1 pa-8 d-flex justify-space-between" @click="onClick(exemp)" v-for="exemp in listExemp" :key="exemp.numTypeExemp">
        <v-row class="align-center">
          <v-col cols="12" sm="3" class="d-flex justify-center"><v-icon size="x-large" dark color="primary">{{getIcon(exemp)}}</v-icon></v-col>
          <v-col cols="12" sm="9" class="d-flex justify-start"><span class="group">{{ exemp.libelle }}</span></v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import DemandesService from '@/service/DemandesService';

const typeExemp = defineModel();
const emits = defineEmits(['click'])
const listExemp = ref([]);

onMounted(() => {
  DemandesService.getTypeExemp()
    .then(response => {
      listExemp.value = response.data;
    })
})

function getIcon(exemp){
  if(exemp.numTypeExemp === 1) return "mdi-book-open";
  if(exemp.numTypeExemp === 2) return "mdi-text-box-multiple";
  return "mdi-book-open-blank-variant";
}

function onClick(exemp){
  typeExemp.value = exemp;
  emits('click');
}

</script>

<style scoped>
.btn-perso:hover{
  background-color: lightgrey;
  transition-duration: 0.3s;
  cursor: pointer;
}

.group {
  font-size: large;
  font-weight: bold ;
  border-radius: 5%;
}
</style>
