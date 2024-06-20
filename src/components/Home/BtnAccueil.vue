<template>
  <div
    class="btnAccueil py-12  px-4 d-flex align-center rounded"
    style=" border-radius: 20px;"
    @click="router.push(route)"
  >
    <v-icon x-large color="grey-darken-2" class="mr-3">{{ icon }}</v-icon>
    <h3 class="flex-grow-1 text-center">
      <slot/>
    </h3>
  </div>
</template>

<script setup>
import router from '@/router';

const props = defineProps({
  icon: { type: String, required: true },
  route: { type: String, required: true }
})
</script>
<style scoped>
.btnAccueil:hover {
  cursor: pointer;
  background-color: lightgrey !important;
  transition-duration: 0.3s;
}
.btnAccueil {
  border: 1px solid black;
}
</style>
