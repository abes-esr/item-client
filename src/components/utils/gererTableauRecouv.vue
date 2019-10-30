<template>
  <tableau :archive=false :darkMode="darkMode" :modif=this.modif></tableau>
</template>

<script>
import tableau from '@/components/utils/tableau.vue';
import TYPEDEMANDE from '../../enums/typeDemande';

export default {
  name: 'gererTableauRecouv',
  props: {
    darkMode: {
      default: false,
    },
    modif: {
      default: TYPEDEMANDE.DEMANDE_RECOUVREMENT,
    },
  },
  components: {
    tableau,
  },
};
</script>
