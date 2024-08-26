<template>
	<v-container class="fill-height">
		<v-responsive class="align-centerfill-height mx-auto" max-width="900">
			<div class="py-4" />

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

			<v-row>
				<v-col cols="12">
					<div>
						<v-img class="mx-auto my-6" max-width="228" src=""></v-img>

						<v-card class="mx-auto pa-12 pb-8" max-width="448" variant="flat">
							<div class="text-subtitle-1 text-medium-emphasis" v-if="false">Nom utilisateur</div>

							<v-text-field density="compact" placeholder="Utilisateur" prepend-inner-icon="mdi-account-outline" variant="outlined" v-model="userLogin"></v-text-field>

							<div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between" v-if="false">
								Password

								<a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank" v-if="false"> Forgot login password?</a>
							</div>

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

							<v-btn class="mb-8" color="blue" size="large" variant="tonal" :loading="isLoading" :disabled="userLogin.length === 0 || userPassword.length === 0" block @click="login()">Se connecter</v-btn>
						</v-card>
					</div>
				</v-col>
			</v-row>
		</v-responsive>
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
