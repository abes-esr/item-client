<template>
    <tableau :archive=false :darkMode="darkMode" :modif=false></tableau>
</template>

<script>
import tableau from '@/components/exemplarisation/tableauExemp.vue';

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
