<template>
  <v-stepper v-model="currentStep" vertical>
    <v-stepper-step :complete="currentStep > 1" step="1">
      Step one
      <template v-slot:subtitle>
        Personal details
      </template>
    </v-stepper-step>

    <v-stepper-content step="1">
      <!-- Content for step 1 -->
      <v-btn color="primary" @click="currentStep = 2">
        Continue
      </v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="currentStep > 2" step="2">
      Step two
      <template v-slot:subtitle>
        Additional information
      </template>
    </v-stepper-step>

    <v-stepper-content step="2">
      <!-- Content for step 2 -->
      <v-btn color="primary" @click="currentStep = 3">
        Continue
      </v-btn>
      <v-btn text @click="currentStep = 1">
        Back
      </v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="currentStep > 3" step="3">
      Step three
      <template v-slot:subtitle>
        Review and submit
      </template>
    </v-stepper-step>

    <v-stepper-content step="3">
      <!-- Content for step 3 -->
      <v-btn color="primary" @click="onClickFinish">
        Finish
      </v-btn>
      <v-btn text @click="currentStep = 2">
        Back
      </v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue';

const currentStep = ref(1);
const finished = ref(false);

const onClickFinish = () => {
  finished.value = true;
  alert('Finished');
};
</script>
