<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col md="7">
        <v-stepper v-model="currentStep">
          <v-stepper-header>
            <v-stepper-item
            editable
            title="Séléction du RCR">
            </v-stepper-item>
            <v-stepper-item
              title="Téléchargement">
            </v-stepper-item>
          </v-stepper-header>

          <v-stepper-window>
            <v-stepper-window-item>
              <rcr v-model="rcrSelected" @validate="console.log"></rcr>
            </v-stepper-window-item>
            <v-stepper-window-item>
              <upload-file @validate="console.log"></upload-file>
            </v-stepper-window-item>
          </v-stepper-window>

          <v-stepper-actions>
          </v-stepper-actions>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import Rcr from '@/components/Rcr.vue';
import UploadFile from '@/components/UploadFile.vue';
import { ref } from 'vue';

const rcrSelected = ref();
const currentStep = ref();
</script>
