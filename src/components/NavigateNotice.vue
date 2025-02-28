<template>
  <!--Boutons de navigation-->
  <!--Conteneur bouton 1-->
  <v-row class="d-flex justify-center">
    <v-btn
      class="mt-3"
      :disabled="isFirstPage"
      large
      dark
      @click="first"
      aria-label="Première ligne">
      <v-icon>mdi-page-first</v-icon>
    </v-btn>
  </v-row>
  <v-row class="d-flex justify-center">
    <span aria-label="Navigation à la première ligne">Première ligne</span>
  </v-row>
  <!--Conteneur bouton 2-->
  <v-row class="d-flex justify-center">
    <v-btn
      class="mt-3"
      :disabled="isFirstPage"
      large
      dark
      @click="prev"
      aria-label="Ligne précédente">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
  </v-row>
  <v-row class="d-flex justify-center">
    <span aria-label="Navigation à la ligne précédente">Ligne précédente</span>
  </v-row>
  <!--Conteneur bouton 3-->
  <v-row class="d-flex justify-center">
    <v-btn
      class="mt-3"
      :disabled="isLastPage"
      large
      dark
      @click="next"
      aria-label="Ligne suivante">
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </v-row>
  <v-row class="d-flex justify-center">
    <span aria-label="Navigation à la ligne suivante">Ligne suivante</span>
  </v-row>
  <!--Conteneur bouton 4-->
  <v-row class="d-flex justify-center">
    <v-btn
      class="mt-3"
      :disabled="isLastPage"
      large
      dark
      @click="last"
      aria-label="Dernière ligne">
      <v-icon>mdi-page-last</v-icon>
    </v-btn>
  </v-row>
  <v-row class="d-flex justify-center">
    <span aria-label="Navigation à la dernière ligne">Dernière ligne</span>
  </v-row>
</template>
<script setup>
import { computed } from 'vue';

const nbNotice = defineModel();
const emits = defineEmits(['clicked']);

const isFirstPage = computed(() => {
  return nbNotice.value.nbNoticeEnCours === 0;
});
const isLastPage = computed(() => {
  return nbNotice.value.nbNoticeEnCours === nbNotice.value.nbTotalNotice - 1;
});

function first() {
  nbNotice.value.nbNoticeEnCours = 0;
  emits('clicked');
}

function last() {
  nbNotice.value.nbNoticeEnCours = nbNotice.value.nbTotalNotice - 1;
  emits('clicked');
}

function next() {
  nbNotice.value.nbNoticeEnCours++;
  emits('clicked');
}

function prev() {
  nbNotice.value.nbNoticeEnCours--;
  emits('clicked');
}
</script>
