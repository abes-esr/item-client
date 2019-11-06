<template>
  <tableau :archive=false :darkMode="darkMode" :modif=this.modif></tableau>
</template>

<script>
import TYPEDEMANDE from '../../enums/typeDemande';
import tableau from '@/components/utils/tableau.vue';

export default {
  name: 'gererTableauExemp',
  props: {
    darkMode: {
      default: false,
    },
    modif: {
      default: TYPEDEMANDE.DEMANDE_EXEMPLARISATION,
    },
  },
  components: {
    tableau,
  },
};
</script>
