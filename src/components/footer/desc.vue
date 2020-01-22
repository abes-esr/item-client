<template>
    <!-- DESCRIPTION
    APPARAIT DANS LE FOOTER AGGRANDIT SUR LA PAGE DE LOGIN UNIQUEMENT -->
    <v-card flat tile color="primary">
        <v-container>
            <v-row>
                <v-col cols="12" sm="12" md="6" lg="6">
                    <v-card-text class="white--text pt-0 text-left">
                      Cette application est à destination des coordinateurs du réseau Sudoc.
                      Elle permet la création et la modification en masse des données d'exemplaires d'un RCR.
                      Ces traitements sont automatiquement répercutés dans les fichiers de transferts réguliers.
                    </v-card-text>
                </v-col>
                <hide-at :breakpoints="{small: 620, medium: 1500, large: 1600}" breakpoint="mediumAndBelow">
                <v-col cols="12" sm="12" md="3" lg="3">
                    <v-card-text class="white--text item-text-center">
                      <v-list-item-content>
                        <v-list-item-title class="headline mb-1">Assistance</v-list-item-title>
                        <v-list-item-subtitle><a class="white--text" href="https://stp.abes.fr/node/3?origine=sudocpro" target="_blank" rel="noopener" style="margin-left: -0em;">Guichet ABESstp</a></v-list-item-subtitle>
                      </v-list-item-content>
                    </v-card-text>
                </v-col>
                </hide-at>
                <hide-at :breakpoints="{small: 620, medium: 1500, large: 1600}" breakpoint="mediumAndBelow">
                <v-col cols="12" sm="12" md="1" lg="1">
                  <v-card-text class="justify-center">
                    <v-img :src="require('@/assets/logo-mesri.png')" alt="Logo Enseignement Supérieur" max-width="60"></v-img>
                  </v-card-text>
                </v-col>
                </hide-at>
                  <hide-at :breakpoints="{small: 620, medium: 1500, large: 1600}" breakpoint="mediumAndBelow">
                <v-col cols="12" sm="12" md="2" lg="2">
                  <v-card-text class="justify-center">
                    <v-img :src="require('@/assets/abes.png')" alt="Logo ABES" max-width="110"></v-img>
                  </v-card-text>
                </v-col>
              </hide-at>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
import { hideAt } from 'vue-breakpoints';

export default {
  components: { hideAt },
};
</script>

<style scoped>
    .v-card{
        padding-top: 20px;
    }
    a {
        text-decoration: none;
        margin-left: 20px;
    }
</style>
