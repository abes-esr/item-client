<template>
  <v-card flat :loading="isLoading">
    <v-card-title style="background-color: #295494; color: white" class="d-flex justify-space-between">
      <span>Choix du type de fichier</span>
      <v-btn depressed variant="text" @click="deleted()" prepend-icon="mdi-delete">Supprimer</v-btn>
    </v-card-title>
    <v-card-text class="pa-0 ma-0">
      <v-overlay v-if="isLoading" v-model="overlay" class="justify-center align-center" contained>
        <v-progress-circular
          color="info"
          indeterminate
        ></v-progress-circular>
      </v-overlay>
      <v-hover v-slot="{ isHovering, props }" v-for="type in types" :key="type">
        <div v-bind="props" :class="`btn-perso elevation-${isHovering ? 6 : 2} pa-5 ma-1 d-flex justify-space-between`" @click="onClick(type)">
          <v-row class="align-center">
            <v-col cols="12" sm="3" class="d-flex justify-center">
              <v-icon size="x-large" dark color="primary"> mdi-file-document-outline  </v-icon>
            </v-col>
            <v-col cols="12" sm="9" class="d-flex justify-start">
              <span class="group large-text">Fichier {{ type }}</span>
            </v-col>
          </v-row>
        </div>
      </v-hover>
    </v-card-text>
  </v-card>
</template>
<script setup>

import { ref } from 'vue';

const emits = defineEmits(['clicked','deleted'])
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})
const model = defineModel();
const types = ['PPN','EPN'];
const overlay = ref(true);

function onClick(type) {
  model.value = type;
  emits('clicked')
}

function deleted() {
  emits('deleted');
}

</script>

<style scoped>
.large-text {
  font-size: 1.1rem;
  font-weight: bold;
}
</style>
