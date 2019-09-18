<template>
  <!-- PAGE D'ACCUEIL -->
  <v-row class="container">
  <v-row justify="center">
    <menu-cards :cardHeight=9 iconType="pie_chart" routerLink="tab" titleName="Calculer mon taux de recouvrement" class="item-horizontal-align menu-card"></menu-cards>
  </v-row>
  <v-row>
    <v-col>
      <menu-cards :cardHeight=9 iconType="add_circle_outline" routerLink="rcrEx" titleName="Créer des exemplaires" class="item-horizontal-align"></menu-cards>
      <menu-cards :cardHeight=9 iconType="sort" routerLink="tabEx" titleName="Gérer mes demandes d'exemplarisation" class="item-horizontal-align"></menu-cards>
    </v-col>
    <v-col>
      <menu-cards :cardHeight=9 iconType="edit" routerLink="rcr" titleName="Modifier des exemplaires" class="item-horizontal-align"></menu-cards>
      <menu-cards :cardHeight=9 iconType="sort" routerLink="tab" titleName="Gérer mes demandes de modification" class="item-horizontal-align"></menu-cards>
    </v-col>
  </v-row>
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
    margin-top: 3em;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  @media all and (max-width: 6em) {
    .container {
      width: 100%
    }
  }
  @media screen and (max-width: 600px){
    .menu-card {
      max-width: 22.4em;
    }
  }
</style>
