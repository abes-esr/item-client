<template>
    <v-app class="h-100 overflow-hidden">
      <maintenance/>
      <nav>
        <Header @logout-success="onLogout" @toggle-drawer="toggleDrawer"/>
        <Navbar :drawer="drawer" @close="drawer = false" />
      </nav>
      <v-main class="d-flex flex-column overflow-auto">
        <div class="notificationContainer">
          <v-slide-y-transition group>
            <v-alert
              v-for="notification in errorsList"
              :color=alertType
              :key="notification[0]"
            >
              <p class="mb-4">{{ notification[1].message }}</p>
              <p class="mb-4">{{ notification[1].description }}</p>
              <div style="text-align: right"><v-btn @click="removeNotification(notification[0])">CLOSE</v-btn></div>
            </v-alert>
          </v-slide-y-transition>
        </div>
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
import { computed, ref, watch } from 'vue';
import Header from '@/components/Structure/Header.vue';
import Navbar from '@/components/Structure/Navbar.vue';
import Footer from '@/components/Structure/Footer.vue';
import router from '@/router/index';
import { HttpStatusCode } from 'axios';
import InfoAppBanner from '@/components/Structure/InfoAppBanner.vue';
import { useAuthStore } from '@/store/authStore';
import { useRoute } from 'vue-router';
import Maintenance from '@/components/Structure/Maintenance.vue';

const drawer = ref(false);

const alertType = ref(null)

const errorsList = ref(new Map())

let idActualMessageErrNetwork = null;

let errorType = null

const authStore = useAuthStore();

const authenticated = computed(() => {
  return authStore.isAuthenticated;
});

const route = useRoute();

watch(
  () => route.query.error,
  (error) => {
    if (error) {
      let newError = {
        message: 'Erreur réseau',
        description: 'Service indisponible : merci de réessayer ultérieurement.'
      };
      const notificationId = self.crypto.randomUUID()
      errorsList.value.set(notificationId, newError)
    }
  },
  { immediate: true } // Option pour exécuter le watcher dès le montage du composant
);

function addError(error) {
  const notificationId = self.crypto.randomUUID()
  alertType.value = "error"
  let newError = {
    message: 'Erreur',
    description: ''
  }
  if(!error.response){
    removeNotification(idActualMessageErrNetwork)
    idActualMessageErrNetwork = notificationId;
    errorType = "ERR_NETWORK"
    newError.message = 'Erreur réseau : ' + error.code
    newError.description = 'Service indisponible : merci de réessayer ultérieurement.'
  }else{
    if (error.response.status === HttpStatusCode.NotFound){
      newError.message = 'Impossible de récupérer les données'
      newError.description = 'Vérifiez que vos urls d\'appel au serveur sont correctes ainsi que vos clés d\'autorisation ' + '(' + error.config.url + ')'
    }
    if (error.response.status === HttpStatusCode.Forbidden) {
      newError.message = 'Accès rejeté';
      newError.description = 'Vérifiez que vos urls d\'appel au serveur sont correctes ainsi que vos clés d\'autorisation ' + '(' + error.config.url + ')';
    }
    if (error.response.status === HttpStatusCode.Unauthorized) {
      newError.message = 'Accès refusé';
      newError.description = error.response.data.message + '(' + error.config.url + ')';
    }
    if (error.response.status === HttpStatusCode.BadRequest) {
      newError.message = 'Accès rejeté';
      newError.description = 'Mauvaise requête : contrôlez les paramètres de votre requête et observez les logs du serveur pour plus d\'informations ' + '(' + error.config.url + ')';
    }
    if (error.response.status.toString().startsWith('5')) {
      newError.message = 'Problème de disponibilité du serveur';
      newError.description = 'Retentez plus tard. Vérifiez la disponibilité de la base de donnée (Etat des serveurs) en cliquant en bas à gauche sur l\'icone de paramètres. Si le problème perdure, contactez l\'assistance';
    }
    newError.description = 'Erreur ' + error.response.status;
  }
  if (error?.response?.data?.detail) {
    newError.description = error.response.data.detail;
  } else if (error?.response?.data?.message) {
    newError.description = error.response.data.message;
  }
  if (error.request.url) {
    newError.description = 'Problème de disponibilité du fichier demandé';
  }
  addNotification(notificationId, newError)
}

function onLogout() {
  router.push('identification');
}

function toggleDrawer() {
  drawer.value = !drawer.value;
}

function addNotification(notificationId, message) {
  errorsList.value.set(notificationId, message)
  if (errorType === "ERR_NETWORK") {
    setTimeout(() => removeNotification(notificationId), 9000) // impose un timeout au v-alert pour que les alertes de type ERR_NETWORK ne surchargent pas la Map errorsList
  }
}

function removeNotification(notificationId) {
  if (notificationId != null) {
    errorsList.value.delete(notificationId)
  }
}

function clearErrors() {
  errorsList.value = new Map()
}

</script>

<style>
/*Declaré en global*/

.custom-card-title {
  background-color: v-bind('$vuetify.theme.current.colors.primary');
  color: v-bind('$vuetify.theme.current.colors.textColor');
}

.notificationContainer {
  position: fixed;
  top: 80px;
  right: 10px;
  display: grid;
  grid-gap: 0.5em;
  z-index: 99;
}
</style>
