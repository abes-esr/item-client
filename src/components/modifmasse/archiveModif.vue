<template>
    <tableau :archive=true :modif=true></tableau>
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
