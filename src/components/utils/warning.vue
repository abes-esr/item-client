<template>
  <v-overlay
    absolute
    v-model="warningDialog"
    persistent
  >
    <v-alert
      type="warning"
      prominent
      border="left"
    >
      Service en maintenance
    </v-alert>
  </v-overlay>
</template>
<script>

export default {
  name: 'warning',
  data() {
    return {
      warningDialog: false,
    }
  }
};
</script>
<style>
  v-alert{
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
  }
</style>
