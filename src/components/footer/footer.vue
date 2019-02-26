<template>
    <v-footer height="auto" color="secondary">
      <v-layout>
          <v-btn color="white" flat round href="http://abes.fr/">&copy; 2019 — <strong>ABES</strong></v-btn>
           <v-spacer></v-spacer>
          <v-btn color="white" flat round @click="$router.push({ name: 'donnees' })">
            Données Personnelles
          </v-btn>
          <v-btn color="white" flat round @click="$router.push({ name: 'cgu' })">
            Conditions Générales d'Utilisation (CGU)
          </v-btn>
          <v-btn color="white" flat round @click="$router.push({ name: 'mentions' })">
            Mentions Légales
          </v-btn>
      </v-layout>
    </v-footer>
</template>

<style scoped>
 .v-btn {
     text-transform: none !important;
 }
 </style>
