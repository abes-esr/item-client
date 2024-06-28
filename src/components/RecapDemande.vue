<template>
  <!-- INFOS GENERALES DE LA DEMANDE -->
  <div id="demInfos" class="elevation-2 mb-4 mt-2">
    <h3 class="d-flex justify-center">Ma demande</h3>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-row class="d-flex justify-center pa-1">Numéro de Demande</v-row>
          <v-row class="d-flex justify-center pa-1">{{ demande.id }}</v-row>
        </v-col>
        <v-col>
          <v-row class="d-flex justify-center pa-1">Date de modification</v-row>
          <v-row class="d-flex justify-center pa-1">{{ demande.dateModification }}</v-row>
        </v-col>
        <v-col>
          <v-row class="d-flex justify-center pa-1">RCR</v-row>
          <v-row class="d-flex justify-center pa-1">{{ demande.rcr }} - {{ demande.shortname }}</v-row>
        </v-col>
        <v-col>
          <v-row class="d-flex justify-center pa-1">Type d'exemplarisation</v-row>
          <v-row class="d-flex justify-center pa-1">{{ demande.typeExemp }}</v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const props = defineProps({
  demande: {type: Object, required: true}
});

</script>
