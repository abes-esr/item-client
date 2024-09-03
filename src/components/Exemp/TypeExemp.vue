<template>
  <v-card flat :loading="isLoading">
    <v-card-title class="d-flex justify-space-between custom-card-title">
      <span>Choix du type d'exemplarisation</span>
      <v-btn depressed variant="text" @click="deleted()" prepend-icon="mdi-delete">Supprimer</v-btn>
    </v-card-title>
    <v-card-text class="pa-0 ma-0">
      <v-overlay v-if="isLoading" v-model="overlay" class="justify-center align-center" contained>
        <v-progress-circular
          color="info"
          indeterminate
        ></v-progress-circular>
      </v-overlay>
      <v-hover v-slot="{ isHovering, props }" v-for="exemp in listExemp" :key="exemp.numTypeExemp">
        <div v-bind="props" :class="`btn-perso elevation-${isHovering ? 6 : 2} pa-5 ma-1 d-flex justify-space-between`" @click="onClick(exemp)">
          <v-row class="align-center">
            <v-col cols="12" sm="3" class="d-flex justify-center">
              <v-icon size="x-large" dark color="primary">{{ getIcon(exemp) }}</v-icon>
            </v-col>
            <v-col cols="12" sm="9" class="d-flex justify-start"><span class="group">{{ exemp.libelle }}</span></v-col>
          </v-row>
        </div>
      </v-hover>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import itemService from '@/service/DemandesService';

const typeExemp = defineModel();
const emits = defineEmits(['click', 'deleted']);
const props = defineProps({ isLoading: { type: Boolean } });
const listExemp = ref([]);
const overlay = ref(true);

onMounted(() => {
  itemService.getTypeExemp()
    .then(response => {
      listExemp.value = response.data;
    });
});

function getIcon(exemp) {
  if (exemp.numTypeExemp === 1) return 'mdi-book-open';
  if (exemp.numTypeExemp === 2) return 'mdi-text-box-multiple';
  return 'mdi-book-open-blank-variant';
}

function onClick(exemp) {
  typeExemp.value = exemp;
  emits('click');
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
  font-size: large;
  font-weight: bold;
  border-radius: 5%;
}
</style>
