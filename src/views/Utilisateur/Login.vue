<template>
  <v-container class="fill-height" fluid >
    <v-row align="center" justify="center">
      <v-col sm="8" md="4">
        <v-row v-if="incident">
          <v-col cols="12">
            <v-card class="py-4" color="surface-variant" prepend-icon="mdi-warning" rounded="lg" variant="outlined">
              <template #title>
                <h2 class="text-h5 font-weight-bold">Information sur le service</h2>
              </template>

              <template #subtitle>
                <div class="text-subtitle-1">
                  Message concernant le statut du service avec incident potentiel ou interruption.<br />
                  Nous vous invitons à lire le message dans son intégralité.
                </div>
              </template>

              <v-overlay opacity=".12" scrim="primary" contained model-value persistent />
            </v-card>
          </v-col>
        </v-row>
        <v-card class="elevation-5">
          <v-card-title class="py-4" style="background-color: #295494; color: white" >
            <span>Connexion</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" class="pt-5">
              <v-text-field density="compact" placeholder="Utilisateur" prepend-inner-icon="mdi-account-outline" variant="outlined" v-model="userLogin"></v-text-field>
              <v-text-field
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                density="compact"
                placeholder="Mot de passe"
                prepend-inner-icon="mdi-key-outline"
                variant="outlined"
                @keydown.enter="login()"
                @click:append-inner="visible = !visible"
                v-model="userPassword"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="px-4">
            <v-spacer></v-spacer>
            <v-btn color="primary"
                   variant="flat"
                   size="large"
                   :loading="isLoading" :disabled="userLogin.length === 0 || userPassword.length === 0"
                   @click="login()">
              Se connecter
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import {ref} from 'vue'
import DemandesService from '@/service/DemandesService'
import router from '@/router'
import {useAuthStore} from '@/store/authStore'

const service = DemandesService
const authStore = useAuthStore()

//Emit
const emit = defineEmits(['backendError', 'backendSuccess'])

const incident = ref(false)
const userLogin = ref('')
const userPassword = ref('')
const visible = ref(false)
const isLoading = ref(false)

async function login() {
  isLoading.value = true;
  try {
    const utilisateur = await service.login(userLogin.value, userPassword.value)
    authStore.login(utilisateur, utilisateur.token)
    const user = authStore.user
    emit('backendSuccess')
    if (user && user.email) {
      await router.push('/accueil')
    } else {
      await router.push('/premiere-connexion')
    }
  } catch (error) {
    console.error('Login error:', error)
    emit('backendError', error)
  } finally {
    isLoading.value = false;
  }
}
</script>
