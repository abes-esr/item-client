<template>
    <!-- DESCRIPTION
    APPARAIT DANS LE FOOTER AGGRANDIT SUR LA PAGE DE LOGIN UNIQUEMENT -->
    <v-card flat tile class="item-primary-color-background">
        <v-container>
            <v-row  >
                <v-col cols="12" sm="12" md="12" lg="5">
                    <v-card-text class="white--text pt-0 text-left">
                        Cette application est à destination des coordinateurs du réseau Sudoc.
                        Elle permet la modification en masse des données d'exemplaire d'un RCR pour un ILN donné.
                        Ces traitements sont automatiquement répercutés dans les fichiers de transfert régulier.
                    </v-card-text>
                </v-col>
              <hide-at :breakpoints="{small: 620, medium: 1500, large: 1600}" breakpoint="mediumAndBelow">
                <v-col cols="12" sm="12" md="12" lg="3">
                    <v-card-text class="white--text pt-0 text-left">
                        <span class="title">Assistance</span><br />
                        <a class="white--text pt-0 text-left" href="https://stp.abes.fr/node/3?origine=sudocpro" target="_blank" rel="noopener">Guichet ABESstp</a>
                    </v-card-text>
                </v-col>
              </hide-at>
                <hide-at :breakpoints="{small: 620, medium: 1500, large: 1600}" breakpoint="mediumAndBelow">
                <v-col cols="12" sm="12" md="12" lg="2">
                    <v-row justify="end"><v-img :src="require('@/assets/logo-mesri.png')" alt="Logo Enseignement Supérieur" max-width="60"></v-img></v-row>
                </v-col>
                </hide-at>
                  <hide-at :breakpoints="{small: 620, medium: 1500, large: 1600}" breakpoint="mediumAndBelow">
                <v-col cols="12" sm="12" md="12" lg="2">
                    <v-row justify="end"><v-img :src="require('@/assets/abes.png')" alt="Logo ABES" max-width="110"></v-img></v-row>
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
