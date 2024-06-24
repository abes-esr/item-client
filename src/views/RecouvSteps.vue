<template>
  <v-container class="fill-height" fluid >
    <v-row align="center" justify="center">
      <v-col md="7">
        <v-stepper
          :items="['1','2']">
          <template v-slot:item.1>
            <rcr @validate="console.log"></rcr>
          </template>

          <template v-slot:item.2>
            <upload-file @validate="console.log"></upload-file>
          </template>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import Rcr from '@/components/Rcr.vue'
import UploadFile from '@/components/UploadFile.vue';
</script>
