<template>
  <v-navigation-drawer v-if="authenticated && drawer2" width="18em" temporary>
    <v-list-item three-line>
      <v-list-item>
        <v-list-item-title class="text-h6 text-wrap">
          Utilisateur
        </v-list-item-title>
        <v-list-item-subtitle class="text-wrap">
          <span v-if="!isAdmin">
            Vous êtes habilité à intervenir<br />
            sur les exemplaires des RCR de<br />
            l'ILN à renseigner
          </span>
          <span v-else>Vous disposez des permissions <br />administrateur</span>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item @click="navigateTo('home')">
        <template v-slot:prepend>
          <v-icon>mdi-home</v-icon>
        </template>
        <v-list-item-title>Accueil</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('profil')">
        <template v-slot:prepend>
          <v-icon>mdi-account</v-icon>
        </template>
        <v-list-item-title>Modifier mon adresse mail</v-list-item-title>
      </v-list-item>

      <v-list-item @click="changeTheme">
        <template v-slot:prepend>
          <v-icon>{{ currentThemeIcon }}</v-icon>
        </template>
        <v-list-item-title>Changer de thème</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item>
        <v-list-item-title class="text-h6">Recouvrement</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('rcrRecouv')">
        <template v-slot:prepend>
          <v-icon>mdi-percent</v-icon>
        </template>
        <v-list-item-title>Calculer mon taux <br />de recouvrement</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('tabRecouv')">
        <template v-slot:prepend>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </template>
        <v-list-item-title>Gérer mes taux<br />de recouvrement</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('archiveRecouv')">
        <template v-slot:prepend>
          <v-icon>mdi-archive</v-icon>
        </template>
        <v-list-item-title>Gérer mes taux<br />de recouvrement archivés</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item>
        <v-list-item-title class="text-h6">Creations</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('rcrEx')">
        <template v-slot:prepend>
          <v-icon>mdi-file-plus</v-icon>
        </template>
        <v-list-item-title>Créer des exemplaires</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('tabExemp')">
        <template v-slot:prepend>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </template>
        <v-list-item-title>Gérer mes créations</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('archiveEx')">
        <template v-slot:prepend>
          <v-icon>mdi-archive</v-icon>
        </template>
        <v-list-item-title>Gérer mes créations<br />archivées</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item>
        <v-list-item-title class="text-h6">Modifications</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('rcr')">
        <template v-slot:prepend>
          <v-icon>mdi-file-document-edit</v-icon>
        </template>
        <v-list-item-title>Modifier des exemplaires</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('tabModif')">
        <template v-slot:prepend>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </template>
        <v-list-item-title>Gérer mes modifications</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('archive')">
        <template v-slot:prepend>
          <v-icon>mdi-archive</v-icon>
        </template>
        <v-list-item-title>Gérer mes modifications<br />archivées</v-list-item-title>
      </v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

const props = defineProps({
  drawer2: {
    type: Boolean,
    required: true,
  },
  authenticated: {
    type: Boolean,
    required: true,
  },
})

const router = useRouter()

const theme = useTheme()
const themes = ['light', 'dark', 'blackAndWhite']

const isAdmin = ref(false)

const currentThemeIcon = computed(() => {
  const currentTheme = theme.global.name.value
  switch (currentTheme) {
    case 'light':
      return 'mdi-weather-sunny'
    case 'dark':
      return 'mdi-weather-night'
    case 'blackAndWhite':
      return 'mdi-brightness-6'
    default:
      return 'mdi-theme-light-dark'
  }
})

function navigateTo(routeName) {
  router.push({ name: routeName }).catch(err => {})
}

function changeTheme() {
  const currentIndex = themes.indexOf(theme.global.name.value)
  const nextIndex = (currentIndex + 1) % themes.length
  theme.global.name.value = themes[nextIndex]
}

// TODO create axios call to set isAdmin value
</script>
