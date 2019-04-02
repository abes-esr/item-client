<template>
  <!-- PAGE D'ACCUEIL -->
  <v-layout row class="container">
    <v-flex xs12 md5 fill-height ma-2 pt-5>
      <!--<menu-cards titleName="Créer des exemplaires" iconType="add_circle_outline" routerLink="tab"
                  :cardHeight=7.8></menu-cards>-->
      <menu-cards titleName="Modifier des exemplaires" iconType="edit" routerLink="rcr" :cardHeight=7.8></menu-cards>
      <!--<menu-cards titleName="Supprimer des exemplaires" iconType="delete" routerLink="tab" cardHeight=7.8></menu-cards>-->
    </v-flex>
    <v-flex xs12 md5 fill-height ma-2 pt-5>
      <menu-cards titleName="Gérer mes demandes" iconType="sort" routerLink="tab" :cardHeight=7.8></menu-cards>
    </v-flex>
    <!--<v-flex xs12 md5 fill-height ma-2 pt-5>
      <menu-cards titleName="Calculer mon taux de recouvrement" iconType="pie_chart" routerLink="tab"
                  :cardHeight=7.8></menu-cards>
    </v-flex> -->
  </v-layout>
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
