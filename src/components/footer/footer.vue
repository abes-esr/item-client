<template>
    <v-footer height="auto" color="primary">
      <v-layout justify-center row wrap>
        <v-flex text-xs-center white--text xs12>
          &copy;2019 — <strong><a href="http://abes.fr/">ABES</a></strong>
          <v-btn href="https://stp.abes.fr/" target="_blank" color="white" flat round>
          Assistance
          </v-btn>
          <v-btn color="white" flat round @click="$router.push({ name: 'about' })">
          A Propos
        </v-btn>
        <v-btn color="white" flat round @click="$router.push({ name: 'donnees' })">
          Données Personnelles
        </v-btn>
        <v-btn color="white" flat round @click="$router.push({ name: 'mentions' })">
          Mentions Légales
        </v-btn>
        <v-btn color="white" flat round @click="$router.push({ name: 'cgu' })">
          Conditions Générales d'Utilisation (CGU)
        </v-btn>
        </v-flex>
      </v-layout>
    </v-footer>
</template>

<style scoped>
 .v-btn {
     text-transform: none !important;
 }
 </style>
