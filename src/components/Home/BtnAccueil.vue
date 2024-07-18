<template>
  <v-hover v-slot="{ isHovering, props }">
    <button
      v-bind="props"
      type="button"
      :class="`py-12  px-4 d-flex align-center rounded elevation-${isHovering ? 6 : 2}`"
      style="border-radius: 20px; display: block; width: 100%;"
      @click="router.push(route)"
    >
      <v-row>
        <v-col cols="12" xl="3" lg="3" md="3" sm="3" xs="3" align-self="center">
          <v-icon size="xx-large" color="grey-darken-2"  class="mr-3">{{ icon }}</v-icon>
        </v-col>
        <v-col cols="12" xl="9" lg="9" md="9" sm="9" xs="9" class="d-flex justify-start">
          <span  class="text-h5 font-weight-bold">
            <slot/>
          </span>
        </v-col>
      </v-row>
    </button>
  </v-hover>
</template>

<script setup>
import router from '@/router';

const props = defineProps({
  icon: { type: String, required: true },
  route: { type: String, required: true }
})
</script>
