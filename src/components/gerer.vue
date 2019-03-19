<template>
    <tableau :archive=false></tableau>
</template>

<script>
import tableau from '@/components/utils/tableau.vue';

export default {
  name: 'gerer',
  components: {
    tableau,
  },
};
</script>
