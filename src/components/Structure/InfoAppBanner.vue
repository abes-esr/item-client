<template>
  <v-card flat tile color="primary">
    <v-container>
      <v-row>
        <v-col cols="12" sm="12" md="6" lg="6">
          <v-card-text>
            Cette application est à destination des coordinateurs du réseau Sudoc.
            Elle permet la création et la modification en masse des données d'exemplaires d'un RCR.
            Ces traitements sont automatiquement répercutés dans les fichiers de transferts réguliers.
          </v-card-text>
        </v-col>
        <v-col v-if="$vuetify.display.mdAndUp" cols="12" sm="12" md="2" lg="2">
          <v-card-text>
            <v-list-item>
              <v-list-item-title class="text-h6 mb-1">Assistance</v-list-item-title>
              <v-list-item-subtitle>
                <a class="text-white" href="https://stp.abes.fr/node/3?origine=sudocpro" target="_blank" rel="noopener">
                  Guichet ABESstp
                </a>
              </v-list-item-subtitle>
            </v-list-item>
          </v-card-text>
        </v-col>
        <v-col v-if="$vuetify.display.mdAndUp" cols="12" sm="12" md="2" lg="2">
          <v-card-text class="justify-center">
            <v-img src="../../assets/MESR-logo.png" alt="Logo Enseignement Supérieur" min-width="120" max-width="120"></v-img>
          </v-card-text>
        </v-col>
        <v-col v-if="$vuetify.display.mdAndUp" cols="12" sm="12" md="2" lg="2">
          <v-card-text class="justify-center">
            <v-img src="../../assets/abes.png" alt="Logo ABES" min-width="100" max-width="100"></v-img>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()
</script>
