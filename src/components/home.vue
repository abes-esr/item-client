<template>
  <!-- PAGE D'ACCUEIL -->
  <v-row class="container" style="margin-top: 5em;">
    <v-col class="fill-height ma-2 pt-5" cols="12" md="5" >
      <menu-cards titleName="Créer des <br/>exemplaires" iconType="add_circle_outline" routerLink="rcrEx" :cardHeight=7.8></menu-cards>
      <menu-cards titleName="Supprimer des <br/>exemplaires" iconType="delete" routerLink="tab" :cardHeight=7.8></menu-cards>
      <menu-cards titleName="Gérer mes demandes <br/> d'exemplarisation" iconType="sort" routerLink="tabEx" :cardHeight=7.8></menu-cards>
    </v-col>
    <v-col class="fill-height ma-2 pt-5" cols="12" md="5" >
      <menu-cards titleName="Modifier des <br/>exemplaires" iconType="edit" routerLink="rcr" :cardHeight=7.8></menu-cards>
      <menu-cards titleName="Calculer mon taux <br/>de recouvrement" iconType="pie_chart" routerLink="tab" :cardHeight=7.8></menu-cards>
      <menu-cards titleName="Gérer mes demandes <br/>de modification" iconType="sort" routerLink="tab" :cardHeight=7.8></menu-cards>
    </v-col>
  </v-row>
</template>

<script>
import menuCards from '@/components/utils/menuCards.vue';

export default {
  components: {
    menuCards,
  },
};
</script>

<style scoped>
  .v-card {
    margin-top: 10px;
  }

  .group {
    border-radius: 5%;
    display: flex;
    flex: 1;
    justify-content: space-around;
  }

  .container {
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    display: flex;
    justify-content: center
  }

  @media all and (max-width: 6em) {
    .container {
      width: 100%
    }
  }
</style>
