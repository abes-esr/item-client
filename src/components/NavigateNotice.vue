<template>
  <!--Boutons de navigation-->
  <!--Conteneur bouton 1-->
  <v-row class="d-flex justify-center">
    <v-btn
      icon="mdi-page-first"
      class="mt-3"
      :disabled="isFirstPage"
      :color="isFirstPage ? 'black' : 'success'"
      large
      dark
      @click="first"
      aria-label="Première ligne">
    </v-btn>
  </v-row>
  <v-row class="d-flex justify-center">
    <span aria-label="Navigation à la première ligne">Première ligne</span>
  </v-row>
  <!--Conteneur bouton 2-->
  <v-row class="d-flex justify-center">
    <v-btn
      icon="mdi-chevron-left"
      class="mt-3"
      :disabled="isFirstPage"
      :color="isFirstPage ? 'black' : 'success'"
      large
      dark
      @click="prev"
      aria-label="Ligne précédente">
    </v-btn>
  </v-row>
  <v-row class="d-flex justify-center">
    <span aria-label="Navigation à la ligne précédente">Ligne précédente</span>
  </v-row>
  <!--Conteneur bouton 3-->
  <v-row class="d-flex justify-center">
    <v-btn
      icon="mdi-chevron-right"
      class="mt-3"
      :disabled="isLastPage"
      :color="isLastPage ? 'black' : 'success'"
      large
      dark
      @click="next"
      aria-label="Ligne suivante">
    </v-btn>
  </v-row>
  <v-row class="d-flex justify-center">
    <span aria-label="Navigation à la ligne suivante">Ligne suivante</span>
  </v-row>
  <!--Conteneur bouton 4-->
  <v-row class="d-flex justify-center">
    <v-btn
      icon="mdi-page-last"
      class="mt-3"
      :disabled="isLastPage"
      :color="isLastPage ? 'black' : 'success'"
      large
      dark
      @click="last"
      aria-label="Dernière ligne">
    </v-btn>
  </v-row>
  <v-row class="d-flex justify-center">
    <span aria-label="Navigation à la dernière ligne">Dernière ligne</span>
  </v-row>
</template>
<script setup>
import {computed} from "vue";

const nbNotice = defineModel();
const emits = defineEmits(['clicked']);

const isFirstPage = computed(() => {
  return nbNotice.value.nbNoticeEnCours === 0;
});
const isLastPage = computed(() => {
  return nbNotice.value.nbNoticeEnCours === nbNotice.value.nbTotalNotice - 1;
});


function first(){
  nbNotice.value.nbNoticeEnCours = 0;
  emits('clicked');
}
function last(){
  nbNotice.value.nbNoticeEnCours = nbNotice.value.nbTotalNotice - 1;
  emits('clicked');
}
function next(){
  nbNotice.value.nbNoticeEnCours++;
  emits('clicked');
}
function prev(){
  nbNotice.value.nbNoticeEnCours--;
  emits('clicked');
}
</script>
