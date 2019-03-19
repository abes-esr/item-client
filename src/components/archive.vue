<template>
    <tableau :archive=true></tableau>
</template>

<script>
import tableau from '@/components/utils/tableau.vue';

export default {
  name: 'archive',
  components: {
    tableau,
  },
};
</script>
