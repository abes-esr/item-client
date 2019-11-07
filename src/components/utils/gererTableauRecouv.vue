<template>
  <tableau :archive=false :modif=this.modif></tableau>
</template>

<script>
import tableau from '@/components/utils/tableau.vue';
import TYPEDEMANDE from '../../enums/typeDemande';

export default {
  name: 'gererTableauRecouv',
  props: {
    modif: {
      default: TYPEDEMANDE.DEMANDE_RECOUVREMENT,
    },
  },
  components: {
    tableau,
  },
};
</script>
