<template>
  <v-card elevation="0">
    <v-card-title style="background-color: #295494; color: white" class="d-flex justify-space-between">
      <span><slot></slot></span>
      <v-btn depressed variant="text" @click="deleted()" prepend-icon="mdi-delete">Supprimer</v-btn>
    </v-card-title>
    <v-card-text class="pt-5">
      DOWNLOAD
    </v-card-text>
  </v-card>
</template>
<script setup>
const emits = defineEmits(['deleted']);
const fileModel = defineModel()
function deleted() {
  emits('deleted');
}
</script>
