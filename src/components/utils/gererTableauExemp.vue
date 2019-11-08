<template>
  <tableau :archive=false :modif=this.modif></tableau>
</template>

<script>
import TYPEDEMANDE from '../../enums/typeDemande';
import tableau from '@/components/utils/tableau.vue';

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
