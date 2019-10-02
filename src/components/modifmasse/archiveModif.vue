<template>
    <tableau :archive=true :modif=true></tableau>
</template>

<script>
import tableau from '@/components/exemplarisation/tableauExemp.vue';

export default {
  name: 'archive',
  components: {
    tableau,
  },
};
</script>
