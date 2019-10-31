<template>
    <tableau :archive=true :modif=this.modif></tableau>
</template>

<script>
import tableau from '@/components/utils/tableau.vue';
import TYPEDEMANDE from '../../enums/typeDemande';

export default {
  name: 'archive',
  components: {
    tableau,
  },
  props: {
    modif: {
      default: TYPEDEMANDE.DEMANDE_EXEMPLARISATION,
    },
  },
};
</script>
