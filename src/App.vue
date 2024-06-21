<template>
	<v-app>
		<Header :authenticated="authenticated" @logout-success="onLogout"/>
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
     <!--<AppTable @backendError="setBackendError" @backendSuccess="liftErrors" />-->
    </v-main>
		<Footer />
    <p><strong>e</strong></p>
	</v-app>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import router from '@/router/index'

const backendError = ref(false)
const backendErrorMessage = ref('')
const backendErrorDescription = ref('')
const authenticated = ref(false);

onMounted(() => {
  checkAuthentication();
});

function setBackendError(error) {
  backendError.value = true
  let titleMessage = ''
  if(!error.response){
    backendErrorMessage.value = 'Erreur réseau : ' + error.code
    backendErrorDescription.value = 'Le serveur ne répond pas. Vérifiez sa disponibilité.'
  }else{
    if(error.response.status === 404){
      titleMessage = 'Impossible de récupérer les données'
      backendErrorDescription.value = 'Vérifiez que vos urls d\'appel au serveur sont correctes ainsi que vos clés d\'autorisation ' + '(' + error.config.url + ')'
    }
    if(error.response.status === 403){
      titleMessage = 'Accès rejeté par le serveur'
      backendErrorDescription.value = 'Vérifiez que vos urls d\'appel au serveur sont correctes ainsi que vos clés d\'autorisation ' + '(' + error.config.url + ')'
    }
    if(error.response.status === 401){
      titleMessage = 'Accès refusé par le serveur'
      backendErrorDescription.value = error.response.data.message + '(' + error.config.url + ')'
    }
    if(error.response.status === 400){
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
function onLoginSuccess(){
  authenticated.value = true
  const user = JSON.parse(sessionStorage.getItem('user'));
  if( !user.email ){
    router.push('premiere-connexion')
  } else {
    router.push('accueil')
  }
}
function onLogout(){
  authenticated.value = false
  router.push('identification')
}
function checkAuthentication() {
  const user = sessionStorage.getItem('user');
  authenticated.value = !!user;
}
</script>
