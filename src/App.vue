<template>
	<v-app>
    <Header @logout-success="onLogout" @toggle-drawer="toggleDrawer"/>
    <Navbar :drawer="drawer" @close="drawer = false"/>
		<Footer />
    <v-main>
      <v-alert color="red" :title="backendErrorMessage" variant='outlined' density='compact' type='warning' :text='backendErrorDescription' closable v-if="backendError"></v-alert>
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          @backendError="setBackendError"
          @backendSuccess="liftBackendError"
        />
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import Header from '@/components/Structure/Header.vue'
import Navbar from '@/components/Structure/Navbar.vue'
import Footer from '@/components/Structure/Footer.vue'
import router from '@/router/index'
import {HttpStatusCode} from 'axios'
import {useTheme} from 'vuetify'

const backendError = ref(false)
const backendErrorMessage = ref('')
const backendErrorDescription = ref('')
const drawer = ref(false)

const theme = useTheme()

function setBackendError(error) {
  console.log(JSON.stringify(error))
  backendError.value = true
  let titleMessage = ''
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
  if(error.response.data.message){
    backendErrorDescription.value = error.response.data.message
  }
  if(error.request.url){
    backendErrorDescription.value = 'Problème de disponibilité du fichier demandé'
  }
}

function liftBackendError() {
  backendError.value = false
}

function onLogout(){
  router.push('identification')
}
function toggleDrawer() {
  drawer.value = !drawer.value;
}
</script>
