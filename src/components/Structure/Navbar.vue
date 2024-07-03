<template>
  <v-navigation-drawer v-if="authenticated && drawer" width="18em" temporary>
    <v-list-item three-line>
      <v-list-item>
        <v-list-item-title class="text-h6 text-wrap">
          <p>{{ rights.title }}</p>
        </v-list-item-title>
        <v-list-item-subtitle class="text-wrap">
            <p>{{ rights.message }}</p>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item @click="navigateTo('accueil')">
        <template v-slot:prepend>
          <v-icon>mdi-home</v-icon>
        </template>
        <v-list-item-title>Accueil</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('modification-adresse-mail')">
        <template v-slot:prepend>
          <v-icon>mdi-account</v-icon>
        </template>
        <v-list-item-title>Modifier mon adresse mail</v-list-item-title>
      </v-list-item>

      <v-list-item @click="toggleTheme">
        <template v-slot:prepend>
          <v-icon>{{ theme.global.current.value.dark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
        </template>
        <v-list-item-title>{{ theme.global.current.value.dark ? 'Thème clair' : 'Thème sombre' }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item>
        <v-list-item-title class="text-h6">Recouvrement</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('recouvrement')">
        <template v-slot:prepend>
          <v-icon>mdi-percent</v-icon>
        </template>
        <v-list-item-title>Calculer mon taux <br />de recouvrement</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('recouvrement-tableau')">
        <template v-slot:prepend>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </template>
        <v-list-item-title>Tableau des calculs <br>de taux de recouvrement</v-list-item-title>
      </v-list-item>

    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item>
        <v-list-item-title class="text-h6">Creations</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('exemplarisation')">
        <template v-slot:prepend>
          <v-icon>mdi-file-plus</v-icon>
        </template>
        <v-list-item-title>Créer des exemplaires</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('exemplarisation-tableau')">
        <template v-slot:prepend>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </template>
        <v-list-item-title>Tableau des <br>créations d'exemplaires</v-list-item-title>
      </v-list-item>

    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item>
        <v-list-item-title class="text-h6">Modifications</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('modification')">
        <template v-slot:prepend>
          <v-icon>mdi-file-document-edit</v-icon>
        </template>
        <v-list-item-title>Modifier des exemplaires</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('modification-tableau')">
        <template v-slot:prepend>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </template>
        <v-list-item-title>Tableau des <br>modifications d'exemplaires</v-list-item-title>
      </v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import router from '@/router'
import { useTheme } from 'vuetify'

defineProps({
  drawer: {
    type: Boolean,
    required: true,
  },
  authenticated: {
    type: Boolean,
    required: true,
  },
})

const theme = useTheme()
const emit = defineEmits(['close'])

function navigateTo(routeName) {
  router.push({ name: routeName }).catch(err => {})
  emit('close')
}

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  localStorage.setItem('theme', theme.global.name.value)
}

const rights = computed(() => {
  const user = JSON.parse(sessionStorage.getItem('user'))
  if(user.role === 'ADMIN'){
    rights.title = `Manager ${user.login}`
    rights.message = `ILN ${user.iln} : Vous disposez des
permissions administrateur`
  }
  if(user.role === 'USER'){
    rights.title = `Utilisateur ${user.login}`
    rights.message = `Vous êtes habilité à intervenir
sur les exemplaires des RCR
de l'ILN ${user.iln}`
  }
  return rights
})

</script>

<style scoped>
p {
  white-space: pre-line;
}
</style>
