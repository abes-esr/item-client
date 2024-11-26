<template>
    <v-app class="h-100 overflow-hidden">
      <nav>
        <Header @logout-success="onLogout" @toggle-drawer="toggleDrawer"/>
        <Navbar :drawer="drawer" @close="drawer = false" />
      </nav>
      <v-main class="d-flex flex-column overflow-auto">
          <v-snackbar
          v-for="(error, index) in errorStack"
          :key="index"
          v-model="snackbarIsActive"
          vertical
          timeout="9000"
          color="#B71C1C"
          elevation="24"
          location="top"
          >
            <div class="mb-2" style="font-weight: 800">{{ error.message }}</div>
            {{ error.description }}
          </v-snackbar>
        <div style="flex-grow: 10;">
          <router-view v-slot="{ Component }">
            <component
              :is="Component"
              @backendError="addError"
              @backendSuccess="clearErrors"
            />
          </router-view>
        </div>
        <InfoAppBanner v-if="!authenticated" />
        <Footer style="flex-basis: 0;" />
      </v-main>
    </v-app>
</template>

<script setup>
import {computed, ref, watch} from 'vue'
import Header from '@/components/Structure/Header.vue'
import Navbar from '@/components/Structure/Navbar.vue'
import Footer from '@/components/Structure/Footer.vue'
import router from '@/router/index'
import {HttpStatusCode} from 'axios'
import InfoAppBanner from '@/components/Structure/InfoAppBanner.vue'
import {useAuthStore} from '@/store/authStore'
import {useRoute} from "vue-router";


const errorStack = ref([])
const drawer = ref(false)

const snackbarIsActive = ref()

const authStore = useAuthStore()

const authenticated = computed(() => {
  return authStore.isAuthenticated
})

const route = useRoute();

watch(
  () => route.query.error,
  (error) => {
    if (error) {
      let newError = {
        message: 'Erreur réseau',
        description: 'Service indisponible : merci de réessayer ultérieurement.'
      }
      errorStack.value.push(newError);
    }
  },
  { immediate: true } // Option pour exécuter le watcher dès le montage du composant
);

function addError(error) {
  let newError = {
    message: 'Erreur',
    description: ''
  }
  if(!error.response){
    if (errorStack.value.indexOf('{"message":"Erreur réseau : ERR_NETWORK","description":"Service indisponible : merci de réessayer ultérieurement."}') != null) {
      errorStack.value.splice(errorStack.value.indexOf('{"message":"Erreur réseau : ERR_NETWORK","description":"Service indisponible : merci de réessayer ultérieurement."}'), 1)
    }
    newError.message = 'Erreur réseau : ' + error.code
    newError.description = 'Service indisponible : merci de réessayer ultérieurement.'
  }else{
    if (error.response.status === HttpStatusCode.NotFound){
      newError.message = 'Impossible de récupérer les données'
      newError.description = 'Vérifiez que vos urls d\'appel au serveur sont correctes ainsi que vos clés d\'autorisation ' + '(' + error.config.url + ')'
    }
    if(error.response.status === HttpStatusCode.Forbidden){
      newError.message = 'Accès rejeté'
      newError.description = 'Vérifiez que vos urls d\'appel au serveur sont correctes ainsi que vos clés d\'autorisation ' + '(' + error.config.url + ')'
    }
    if(error.response.status === HttpStatusCode.Unauthorized){
      newError.message = 'Accès refusé'
      newError.description = error.response.data.message + '(' + error.config.url + ')'
    }
    if(error.response.status === HttpStatusCode.BadRequest){
      newError.message = 'Accès rejeté'
      newError.description = 'Mauvaise requête : contrôlez les paramètres de votre requête et observez les logs du serveur pour plus d\'informations ' + '(' + error.config.url + ')'
    }
    if(error.response.status.toString().startsWith('5')){
      newError.message = 'Problème de disponibilité du serveur'
      newError.description = 'Retentez plus tard. Vérifiez la disponibilité de la base de donnée (Etat des serveurs) en cliquant en bas à gauche sur l\'icone de paramètres. Si le problème perdure, contactez l\'assistance'
    }
    newError.description = 'Erreur ' + error.response.status
  }
  if (error?.response?.data?.detail) {
    newError.description = error.response.data.detail;
  } else if (error?.response?.data?.message) {
    newError.description = error.response.data.message;
  }
  if(error.request.url){
    newError.description = 'Problème de disponibilité du fichier demandé'
  }
  errorStack.value.push(newError)
  snackbarIsActive.value = true
}

function clearErrors() {
  errorStack.value = []
}

function closeAlert(index) {
  errorStack.value.splice(index, 1)
}

function onLogout() {
  router.push('identification')
}

function toggleDrawer() {
  drawer.value = !drawer.value
}
</script>

<style>
/*Declaré en global*/

.custom-card-title {
  background-color: v-bind('$vuetify.theme.current.colors.primary');
  color: v-bind('$vuetify.theme.current.colors.textColor');
}

.custom-alert {
  background-color: #FFEBEE !important; /* Fond rouge clair */
  color: #B71C1C !important; /* Texte rouge foncé */
  opacity: 1 !important; /* Assurez-vous que l'alerte est complètement opaque */
}

.custom-alert :deep(.v-alert__close) {
  color: #B71C1C !important; /* Assure que le bouton de fermeture est de la même couleur que le texte */
}
</style>
