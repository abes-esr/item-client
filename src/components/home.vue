<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 id="flexBox">
                <!--
                <v-card raised hover @click="$router.push({ name: 'tab' })">
                    <v-card-title primary-title>
                        <v-container grid-list-md>
                            <v-layout row wrap align-center>
                                <v-flex xs2>
                                    <span class="group pa-3 secondary">
                                        <v-icon x-large dark>add</v-icon>
                                    </span>
                                </v-flex>
                                <v-flex xs6 ml-4>
                                    <h3 class="headline">Créer des exemplaires</h3>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-title>
                </v-card>
                -->


                <!--<v-card raised hover @click="$router.push({ name: 'rcr' })">-->
                    <!--<v-card-title primary-title>-->
                        <!--<v-container grid-list-md>-->
                            <!--<v-layout row wrap align-center>-->
                                <!--<v-flex xs2>-->
                                    <!--<span class="group pa-3 secondary">-->
                                        <!--<v-icon x-large dark>edit</v-icon>-->
                                    <!--</span>-->
                                <!--</v-flex>-->
                                <!--<v-flex xs6 ml-4>-->
                                    <!--<h3 class="headline">Modifier des exemplaires</h3>-->
                                <!--</v-flex>-->
                            <!--</v-layout>-->
                        <!--</v-container>-->
                    <!--</v-card-title>-->
                <!--</v-card>-->

              <menu-cards titleName="test" iconType="edit" routerLink="rcr"></menu-cards>

                             <!--
                <v-card raised hover @click="$router.push({ name: 'tab' })">
                    <v-card-title primary-title>
                        <v-container grid-list-md>
                            <v-layout row wrap align-center>
                                <v-flex xs2>
                                    <span class="group pa-3 secondary">
                                        <v-icon x-large dark>delete</v-icon>
                                    </span>
                                </v-flex>
                                <v-flex xs6 ml-4>
                                    <h3 class="headline">Supprimer des exemplaires</h3>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-title>
                </v-card>
                -->
                <v-card raised hover @click="$router.push({ name: 'tab' })">
                    <v-card-title primary-title>
                        <v-container grid-list-md>
                            <v-layout row wrap align-center>
                                <v-flex xs2>
                                    <span class="group pa-3 secondary">
                                        <v-icon x-large dark>sort</v-icon>
                                    </span>
                                </v-flex>
                                <v-flex xs6 ml-4>
                                    <h3 class="headline">Gérer mes demandes</h3>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-title>
                </v-card>
                <!--
                <v-card raised hover @click="$router.push({ name: 'tab' })">
                    <v-card-title primary-title>
                        <v-container grid-list-md>
                            <v-layout row wrap align-center>
                                <v-flex xs2>
                                    <span class="group pa-3 secondary">
                                        <v-icon x-large dark>bar_chart</v-icon>
                                    </span>
                                </v-flex>
                                <v-flex xs6 ml-4>
                                    <h3 class="headline">Calculer mon taux de recouvrement</h3>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-title>
                </v-card>
                -->
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import menuCards from '@/components/utils/menuCards';

  export default {
    components: {
      menuCards
    }
  }
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
    #flexBox {
      max-width: 700px;
    }
</style>
