<template>
  <v-card elevation="0">
    <v-card-title style="background-color: #295494; color: white" >
      <span>Choix du type d'exemplarisation</span>
    </v-card-title>
    <v-card-text class="pa-0 ma-0">
      <v-btn block class="pa-8 item-global-margin-bottom" rounded="0" v-for="exemp in listExemp" :key="exemp.numTypeExemp">
        <v-container class="d-flex justify-space-between align-center">
          <span class="group pa-3 white"><v-icon size="x-large" dark color="primary">{{getIcon(exemp)}}</v-icon></span>

          <div>
            <b class="headline">{{ exemp.libelle }}</b>
          </div>
        </v-container>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import DemandesService from '@/service/DemandesService';

const listExemp = ref([])

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
</script>
