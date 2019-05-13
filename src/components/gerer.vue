<template>
    <tableau :archive=false :darkMode="darkMode"></tableau>
</template>

<script>
import tableau from '@/components/utils/tableau.vue';

export default {
  name: 'gerer',
  props: {
    darkMode: Boolean,
  },
  components: {
    tableau,
  },
};
</script>
