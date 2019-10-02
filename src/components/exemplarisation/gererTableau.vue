<template>
    <tableau :archive=false :darkMode="darkMode" :modif=this.modif></tableau>
</template>

<script>
import tableau from '@/components/exemplarisation/tableauExemp.vue';

export default {
  name: 'gerer',
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
