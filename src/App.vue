<template>
	<v-app>
    <Header :authenticated="authenticated" @logout-success="onLogout" @toggle-drawer="toggleDrawer2"/>
    <Navbar :authenticated="authenticated" :drawer2="drawer2" v-if="authenticated"/>
		<Footer />
    <v-main>
      <v-alert color="red" :title="backendErrorMessage" variant='outlined' density='compact' type='warning' :text='backendErrorDescription' closable v-if="backendError"></v-alert>
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          @backendError="setBackendError"
          @backendSuccess="liftErrors"
          @login-success="onLoginSuccess"
        />
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import Header from '@/components/Header.vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import router from '@/router/index'
import { HttpStatusCode } from 'axios';
import DemandesService from '@/service/DemandesService'

const backendError = ref(false)
const backendErrorMessage = ref('')
const backendErrorDescription = ref('')
const authenticated = ref(false)
const drawer2 = ref(false)

onMounted(() => {
  checkAuthentication();
});

function setBackendError(error) {
  backendError.value = true
  let titleMessage = ''
  console.log(JSON.stringify(error))
  console.log(JSON.stringify(error.response))
  if(!error.response){
    backendErrorMessage.value = 'Erreur réseau : ' + error.code
    backendErrorDescription.value = 'Le serveur ne répond pas. Vérifiez sa disponibilité.'
  }else{
    if (error.response.status === HttpStatusCode.NotFound){
      titleMessage = 'Impossible de récupérer les données'
      backendErrorDescription.value = 'Vérifiez que vos urls d\'appel au serveur sont correctes ainsi que vos clés d\'autorisation ' + '(' + error.config.url + ')'
    }
    if(error.response.status === HttpStatusCode.Forbidden){
      titleMessage = 'Accès rejeté par le serveur'
      backendErrorDescription.value = 'Vérifiez que vos urls d\'appel au serveur sont correctes ainsi que vos clés d\'autorisation ' + '(' + error.config.url + ')'
    }
    if(error.response.status === HttpStatusCode.Unauthorized){
      titleMessage = 'Accès refusé par le serveur'
      backendErrorDescription.value = error.response.data.message + '(' + error.config.url + ')'
    }
    if(error.response.status === HttpStatusCode.BadRequest){
      titleMessage = 'Accès rejeté par le serveur'
      backendErrorDescription.value = 'Mauvaise requête : contrôlez les paramètres de votre requête et observez les logs du serveur pour plus d\'informations ' + '(' + error.config.url + ')'
    }
    if(error.response.status.toString().startsWith('5')){
      titleMessage = 'Problème de disponibilité du serveur'
      backendErrorDescription.value = 'Retentez plus tard. Vérifiez la disponibilité de la base de donnée (Etat des serveurs) en cliquant en bas à gauche sur l\'icone de paramètres. Si le problème perdure, contactez l\'assistance'
    }
    backendErrorMessage.value = 'Erreur ' + error.response.status + ' : ' + titleMessage
  }
  if(error.response.data.detail){
    backendErrorDescription.value = error.response.data.detail
  }
  if(error.request.url){
    backendErrorDescription.value = 'Problème de disponibilité du fichier demandé'
  }
}

function liftErrors() {
  backendError.value = false
}
function onLoginSuccess(userData) {
  authenticated.value = true;
  if (!userData.email) {
    router.push('premiere-connexion');
  } else {
    router.push('accueil');
  }
}
function onLogout(){
  authenticated.value = false
  router.push('identification')
}
function checkAuthentication() {
  const user = sessionStorage.getItem('user');
  authenticated.value = !!user;
  if (authenticated.value) {
    DemandesService.checkToken()
      .then(() => {
        console.log('Token valide');
      })
      .catch((error) => {
        console.error('Erreur de vérification du token:', error);
        onLogout();
      });
  }
}
function toggleDrawer2() {
  drawer2.value = !drawer2.value;
}
</script>
