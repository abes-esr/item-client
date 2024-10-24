<template>
  <!-- INFOS GENERALES DE LA DEMANDE -->
  <div v-if="demande" id="demInfos" class="elevation-2 mb-4 mt-2">
    <h3 class="d-flex justify-center">{{title}}</h3>
    <v-container >
      <v-row>
        <v-col>
          <v-row class="d-flex justify-center pa-1">Numéro de Demande</v-row>
          <v-row class="d-flex justify-center pa-1">{{ demande.id }}</v-row>
        </v-col>
        <v-col>
          <v-row class="d-flex justify-center pa-1">Date du traitement</v-row>
          <v-row class="d-flex justify-center pa-1">{{ demande.dateModification }}</v-row>
        </v-col>
        <v-col>
          <v-row class="d-flex justify-center pa-1">RCR</v-row>
          <v-row class="d-flex justify-center pa-1">{{ demande.rcr }} - {{ demande.shortname }}</v-row>
        </v-col>
        <v-col v-if="demande.typeExemp">
          <v-row class="d-flex justify-center pa-1">Type de document</v-row>
          <v-row class="d-flex justify-center pa-1">{{ demande.typeExemp }}</v-row>
        </v-col>
        <v-col v-if="demande.traitement">
          <v-row class="d-flex justify-center pa-1">Type de traitement</v-row>
          <v-row class="d-flex justify-center pa-1">{{ demande.traitement }}</v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>

import { computed } from 'vue';

const props = defineProps({
  demande: {type: Object, required: true},
});

const title = computed( () => {
    if(props.demande.type === 'SUPP')
      return "Ma demande de suppression";
    if(props.demande.type === 'EXEMP')
      return "Ma demande de création";
    if(props.demande.type === 'MODIF')
      return "Ma demande de modification";
    if(props.demande.type === 'RECOUV')
      return "Ma demande de recouvrement";
    return "Ma demande";
  }
)


</script>

<style>
#demInfos{
  width: 100%;
}
</style>
