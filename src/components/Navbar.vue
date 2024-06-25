<template>
  <v-navigation-drawer width="18em" app v-if="authenticated && drawer2">
    <v-list-item three-line>
      <v-list-item>
        <v-list-item-title class="title wrap-text">
          Utilisateur
        </v-list-item-title>
        <v-list-item-subtitle class="wrap-text">
					<span v-if="!isAdmin"
          >Vous êtes habilité à intervenir<br />
						sur les exemplaires des RCR de<br />
						l'ILN à renseigner</span
          >
          <span v-else>Vous disposez des permissions <br />administrateur</span>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item v-on:click="$router.push({name: 'home'}).catch(err => {})">
        <v-list-item-action>
          <v-icon>home</v-icon>
        </v-list-item-action>
        <v-list-item>
          <v-list-item-title>Accueil</v-list-item-title>
        </v-list-item>
      </v-list-item>
      <v-list-item v-on:click="$router.push({name: 'profil'}).catch(err => {})">
        <v-list-item-action>
          <v-icon>mail_outline</v-icon>
        </v-list-item-action>
        <v-list-item>
          <v-list-item-title>Modifier mon adresse mail</v-list-item-title>
        </v-list-item>
      </v-list-item>
      <v-list-item v-on:click="saveTheme()">
        <v-switch v-model="$vuetify.theme.dark" style="margin-top: 8px" inset></v-switch>
        <v-list-item-title style="padding-bottom: 1.2em">Changer de thème</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item>
        <v-list-item-title class="title"> Recouvrement </v-list-item-title>
      </v-list-item>
      <v-list-item v-on:click="$router.push({name: 'rcrRecouv'}).catch(err => {})">
        <v-list-item-action>
          <v-icon>mdi-percent</v-icon>
        </v-list-item-action>
        <v-list-item>
          <v-list-item-title>Calculer mon taux <br />de recouvrement</v-list-item-title>
        </v-list-item>
      </v-list-item>
      <v-list-item v-on:click="$router.push({name: 'tabRecouv'}).catch(err => {})">
        <v-list-item-action>
          <v-icon>list</v-icon>
        </v-list-item-action>
        <v-list-item>
          <v-list-item-title>Gérer mes taux<br />de recouvrement</v-list-item-title>
        </v-list-item>
      </v-list-item>
      <v-list-item v-on:click="$router.push({name: 'archiveRecouv'}).catch(err => {})">
        <v-list-item-action>
          <v-icon>archive</v-icon>
        </v-list-item-action>
        <v-list-item>
          <v-list-item-title>Gérer mes taux<br />de recouvrement archivés</v-list-item-title>
        </v-list-item>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item>
        <v-list-item-title class="title"> Creations </v-list-item-title>
      </v-list-item>
      <v-list-item v-on:click="$router.push({name: 'rcrEx'}).catch(err => {})">
        <v-list-item-action>
          <v-icon>edit</v-icon>
        </v-list-item-action>
        <v-list-item>
          <v-list-item-title>Créer des exemplaires</v-list-item-title>
        </v-list-item>
      </v-list-item>
      <v-list-item v-on:click="$router.push({name: 'tabExemp'}).catch(err => {})">
        <v-list-item-action>
          <v-icon>list</v-icon>
        </v-list-item-action>
        <v-list-item>
          <v-list-item-title>Gérer mes créations</v-list-item-title>
        </v-list-item>
      </v-list-item>
      <v-list-item v-on:click="$router.push({name: 'archiveEx'}).catch(err => {})">
        <v-list-item-action>
          <v-icon>archive</v-icon>
        </v-list-item-action>
        <v-list-item>
          <v-list-item-title>Gérer mes créations<br />archivées</v-list-item-title>
        </v-list-item>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item>
        <v-list-item-title class="title"> Modifications </v-list-item-title>
      </v-list-item>
      <v-list-item v-on:click="$router.push({name: 'rcr'}).catch(err => {})">
        <v-list-item-action>
          <v-icon>edit</v-icon>
        </v-list-item-action>
        <v-list-item>
          <v-list-item-title>Modifier des exemplaires</v-list-item-title>
        </v-list-item>
      </v-list-item>
      <v-list-item v-on:click="$router.push({name: 'tabModif'}).catch(err => {})">
        <v-list-item-action>
          <v-icon>list</v-icon>
        </v-list-item-action>
        <v-list-item>
          <v-list-item-title>Gérer mes modifications</v-list-item-title>
        </v-list-item>
      </v-list-item>
      <v-list-item v-on:click="$router.push({name: 'archive'}).catch(err => {})">
        <v-list-item-action>
          <v-icon>archive</v-icon>
        </v-list-item-action>
        <v-list-item>
          <v-list-item-title>Gérer mes modifications<br />archivées</v-list-item-title>
        </v-list-item>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import {ref} from 'vue'

defineProps({
  drawer2: {
    type: Boolean,
    required: true,
  },
  authenticated: {
    type: Boolean,
    required: true,
  },
});

const isAdmin = ref(false)
defineEmits(['update:drawer2'])
function getUserName(){
  console.log('puis à partir de la recupérer le nom a partir de lobjet user actuel du session storage')
}
</script>
