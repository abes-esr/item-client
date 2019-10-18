<template>
    <tableau :archive=false :darkMode="darkMode" :modif=this.modif></tableau>
</template>

<script>
import tableau from '@/components/utils/tableau.vue';

export default {
  name: 'gererTableauModif',
  props: {
    darkMode: {
      default: false,
    },
    modif: {
      default: true,
    },
  },
  components: {
    tableau,
  },
};
</script>
