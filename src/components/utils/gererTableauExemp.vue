<template>
  <tableau :archive=false :modif=this.modif></tableau>
</template>

<script>
import tableau from '@/components/utils/tableau.vue';
import TYPEDEMANDE from '../../enums/typeDemande';

export default {
  name: 'gererTableauExemp',
  props: {
    modif: {
      default: TYPEDEMANDE.DEMANDE_EXEMPLARISATION,
    },
  },
  components: {
    tableau,
  },
};
</script>
