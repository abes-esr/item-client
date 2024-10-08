<template>
  <v-navigation-drawer v-if="authStore.isAuthenticated && drawer" width="18em" temporary>
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

      <v-list-item @click="toggleTheme" @cut="setTheme">
        <template v-slot:prepend>
          <v-icon>{{ theme.global.current.value.dark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
        </template>
        <v-list-item-title>{{ theme.global.current.value.dark ? 'Thème sombre' : 'Thème clair' }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item>
        <v-list-item-title class="text-h6 pb-1">Recouvrement</v-list-item-title>
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
        <v-list-item-title class="text-h6 pb-1">Creations</v-list-item-title>
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
        <v-list-item-title class="text-h6 pb-1">Modifications</v-list-item-title>
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

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item>
        <v-list-item-title class="text-h6 pb-1">Suppressions</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('suppression')">
        <template v-slot:prepend>
          <v-icon>mdi-file-document-remove</v-icon>
        </template>
        <v-list-item-title>Supprimer des exemplaires</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('suppression-tableau')">
        <template v-slot:prepend>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </template>
        <v-list-item-title>Tableau des <br>suppressions d'exemplaires</v-list-item-title>
      </v-list-item>

    </v-list>

  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAuthStore } from '@/store/authStore'

const props = defineProps({
  drawer: {
    type: Boolean,
    required: true,
  },
})

const router = useRouter()
const theme = useTheme()
const authStore = useAuthStore()

const emit = defineEmits(['close'])

function navigateTo(routeName) {
  router.push({ name: routeName }).catch(err => {})
  emit('close')
}

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'itemLightTheme' : 'itemDarkTheme'
  localStorage.setItem('theme', theme.global.name.value)
}
function setTheme() {
  theme.global.name.value = 'itemRngTheme'
}


const rights = computed(() => {
  const user = authStore.getUser
  if (!user) return { title: '', message: '' }

  if (user.role === 'ADMIN') {
    return {
      title: `Manager ${user.login}`,
      message: `ILN ${user.iln} : Vous disposez des
permissions administrateur`
    }
  }
  if (user.role === 'USER') {
    return {
      title: `Utilisateur ${user.login}`,
      message: `Vous êtes habilité à intervenir
sur les exemplaires des RCR
de l'ILN ${user.iln}`
    }
  }
  return { title: '', message: '' }
})

</script>

<style scoped>
p {
  white-space: pre-line;
}
</style>
