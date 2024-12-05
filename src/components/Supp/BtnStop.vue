<template>
  <v-btn icon="mdi-stop"  variant="plain" @click="click">
  </v-btn>
  <dialog-confirmation-stop v-model="dialog" :id="id" @stop="emits('stop')">
  </dialog-confirmation-stop>
</template>
<script setup>
import DialogConfirmationStop from "@/components/Supp/DialogConfirmationStop.vue";
import {ref} from "vue";

const emits = defineEmits(['stop'])
const props = defineProps({
  id:{
    required:true,
    type:Number
  }
})
const dialog = ref(false);

function click() {
  dialog.value = true
}


</script>
