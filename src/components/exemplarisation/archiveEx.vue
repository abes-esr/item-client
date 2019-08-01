<template>
    <tableau :archive=true :modif=false></tableau>
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
