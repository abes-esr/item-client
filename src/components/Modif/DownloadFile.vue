<template>
  <v-card elevation="0">
    <v-card-title style="background-color: #295494; color: white" class="d-flex justify-space-between">
      <span><slot></slot></span>
      <v-btn depressed variant="text" @click="deleted()" prepend-icon="mdi-delete">Supprimer</v-btn>
    </v-card-title>
    <v-card-actions class="py-6">
      <v-spacer></v-spacer>
      <v-btn
        rounded
        x-large
        variant="flat"
        color="#295494"
        ref="fileLinkBtn"
        :href="fileLink"
        :disabled="isDisabled"
        @click="clicked()"
        append-icon="mdi-cloud-download"
        :download="fileName">Télécharger le fichier de correspondances PPN/EPN
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>
<script setup>

const emits = defineEmits(['deleted','clicked']);
const props = defineProps({
  fileName: {
    required: true,
    type: String
  },
  fileLink: {
    required: true,
    type: String
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
})

function clicked(){
  emits('clicked');
}

function deleted() {
  emits('deleted');
}
</script>
<style scoped>
v-btn{
  color: red !important;
}

</style>
