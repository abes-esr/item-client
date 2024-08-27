<template>
  <v-card flat :loading="isLoading">
    <v-card-title class="d-flex justify-space-between custom-card-title">
      <span>Choix du type de traitement</span>
      <v-btn depressed variant="text" @click="deleted()" prepend-icon="mdi-delete">Supprimer</v-btn>
    </v-card-title>

    <v-card-text  class="pa-0 ma-0">
      <v-hover v-slot="{ isHovering, props }" v-for="traitement in listTraitement" :key="traitement.id">
        <div v-bind="props" :class="`btn-perso elevation-${isHovering ? 6 : 2} pa-5 ma-1 d-flex justify-space-between`" @click="onClick(traitement)">
          <v-row class="align-center">
            <v-col cols="12" sm="3" class="d-flex justify-center">
              <v-icon size="xx-large" dark color="primary">{{ getIcon(traitement) }}</v-icon>
            </v-col>
            <v-col cols="12" sm="9" class="d-flex justify-start"><p class="group" >{{ traitement.libelle }}</p></v-col>
          </v-row>
        </div>
      </v-hover>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import DemandesService from '@/service/DemandesService';

const typeTraitement = defineModel();
const emits = defineEmits(['clicked', 'deleted']);
const props = defineProps({ isLoading: { type: Boolean } });
const listTraitement = ref([]);

onMounted(() => {
  DemandesService.getTypeTraitement()
    .then(response => {
      listTraitement.value = response.data;
    });
});

function getIcon(traitement) {
  if (traitement.id === 1) return 'mdi-plus';
  if (traitement.id === 2) return 'mdi-pencil';
  if (traitement.id === 3) return 'mdi-redo';
  if (traitement.id === 4) return 'mdi-close';
  if (traitement.id === 5) return 'mdi-delete';
  return 'mdi-nuke';
}

function onClick(traitement) {
  typeTraitement.value = traitement;
  emits('clicked');
}

function deleted() {
  emits('deleted');
}

</script>

<style scoped>
.btn-perso:hover {
  cursor: pointer;
}

.group {
  font-size: x-large;
}
</style>
