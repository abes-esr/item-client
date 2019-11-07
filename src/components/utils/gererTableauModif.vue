<template>
  <tableau :archive=false :modif=this.modif></tableau>
</template>

<script>
import tableau from '@/components/utils/tableau.vue';
import TYPEDEMANDE from '../../enums/typeDemande';

export default {
  name: 'gererTableauModif',
  props: {
    modif: {
      default: TYPEDEMANDE.MODIFICATION,
    },
  },
  components: {
    tableau,
  },
};
</script>
