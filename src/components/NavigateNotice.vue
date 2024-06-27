<template>
  <!--Boutons de navigation-->
  <!--Conteneur bouton 1-->
  <v-row class="d-flex justify-center">
    <v-btn
      :disabled="nbNotice.nbNoticeEnCours === 0"
      large
      dark
      @click="nbNotice.nbNoticeEnCours = 0"
      aria-label="Première notice">
      <v-icon>mdi-page-first</v-icon>
    </v-btn>
  </v-row>
  <v-row class="d-flex justify-center">
    <div style="width: 4em; text-align: center;">Première notice</div>
  </v-row>
  <!--Conteneur bouton 2-->
  <v-row class="d-flex justify-center">
    <v-btn
      :disabled="nbNotice.nbNoticeEnCours === 0"
      large
      dark
      @click="nbNotice.nbNoticeEnCours--"
      aria-label="Notice précédente">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
  </v-row>
  <v-row class="d-flex justify-center">
    <div style="width: 5em; text-align: center;">Notice précédente</div>
  </v-row>
  <!--Conteneur bouton 3-->
  <v-row class="d-flex justify-center">
    <v-btn
      :disabled="nbNotice.nbNoticeEnCours === nbNotice.nbTotalNotice - 1"
      large
      dark
      @click="nbNotice.nbNoticeEnCours++"
      aria-label="Notice suivante">
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </v-row>
  <v-row class="d-flex justify-center">
    <div style="width: 4em; text-align: center;">Notice suivante</div>
  </v-row>
  <!--Conteneur bouton 4-->
  <v-row class="d-flex justify-center">
    <v-btn
      :disabled="nbNotice.nbNoticeEnCours === nbNotice.nbTotalNotice - 1"
      large
      dark
      @click="nbNotice.nbNoticeEnCours = nbNotice.nbTotalNotice - 1"
      aria-label="Dernière notice">
      <v-icon>mdi-page-last</v-icon>
    </v-btn>
  </v-row>
  <v-row class="d-flex justify-center">
    <div style="width: 4em; text-align: center;">Dernière notice</div>
  </v-row>
</template>
<script setup>
const nbNotice = defineModel();
</script>
