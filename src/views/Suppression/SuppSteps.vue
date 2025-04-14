<template>
	<v-container :class="currentStep === 3 ? '' : 'fill-height'" fluid>
		<v-col :class="currentStep === 3 ? '' : 'fill-height'">
			<recap-demande v-if="currentStep < 3" :demande="demande"></recap-demande>
			<v-row align="center" justify="center">
				<v-col :md="currentStep === 3 ? '' : '7'">
					<v-stepper v-model="currentStep" @update:model-value="changeEtape()" alt-labels>
						<v-stepper-header>
							<v-stepper-item
								:color="currentStep >= 0 ? 'primary' : ''"
								:complete="currentStep > 0"
								:editable="currentStep > 0"
								icon="mdi-numeric-1"
								title="Sélection du RCR"
								:subtitle="demande ? rcrSelected : 'Demande'"
							>
							</v-stepper-item>
							<v-divider></v-divider>
							<v-stepper-item
								:color="currentStep >= 1 ? 'primary' : ''"
								:complete="currentStep > 1"
								:editable="currentStep > 1"
								icon="mdi-numeric-2"
								title="PPN:RCR:EPN"
								:subtitle="typeFileSelected ? 'Fichier ' + typeFileSelected : 'fichier envoyé'"
							>
							</v-stepper-item>
							<v-divider></v-divider>
							<v-stepper-item
								:color="currentStep >= 2 ? 'primary' : ''"
								:complete="currentStep > 2"
								:editable="currentStep > 2"
								icon="mdi-numeric-3"
								title="Envoi"
								subtitle="du fichier"
							>
							</v-stepper-item>
							<v-divider></v-divider>
							<v-stepper-item :color="currentStep >= 3 ? 'primary' : ''" icon="mdi-numeric-4" title="Simulation"> </v-stepper-item>
						</v-stepper-header>

						<v-stepper-window>
							<v-stepper-window-item>
								<rcr v-model="rcrSelected" :is-loading="isLoading"></rcr>
								<v-container class="d-flex justify-space-between">
									<v-spacer></v-spacer>
									<v-btn :disabled="!rcrSelected" :loading="isLoading" @click="createDemande"> Valider </v-btn>
								</v-container>
							</v-stepper-window-item>
							<v-stepper-window-item>
								<type-file v-if="!typeFileSelected" v-model="typeFileSelected" @clicked="setTypeSelected()" @deleted="deleteDemande()"></type-file>
								<select-file v-else-if="!isLoaded" :is-loading="isLoading" v-model="fileSelected" typeFile="PPN" @deleted="deleteDemande()">Selection du fichier PPN </select-file>
								<download-file v-if="isLoaded" :file-link="fileLink" :file-name="fileName" @clicked="isDownloaded = true" @deleted="deleteDemande()"
									>Téléchargement du fichier PPN:RCR:EPN
								</download-file>
								<v-alert v-if="alertMessage" :type="alertType" :icon="alertType === 'error' ? 'mdi-alert' : null">
									<span v-html="alertMessage"></span>
								</v-alert>
								<v-container class="d-flex justify-space-between">
									<v-btn v-if="typeFileSelected && !isLoaded" @click="prevSelectTypeFile"> précédent </v-btn>
									<v-btn v-else-if="isLoaded" @click="prevSelectFile"> précédent </v-btn>
									<v-btn v-else @click="prev"> précédent </v-btn>
									<v-btn v-if="typeFileSelected && !isLoaded" :disabled="!fileSelected" :loading="isLoading" @click="uploadFile()"> Envoyer </v-btn>
									<v-btn v-if="isLoaded" :disabled="!isDownloaded" @click="next"> Suivant </v-btn>
								</v-container>
							</v-stepper-window-item>
							<v-stepper-window-item>
								<v-container>
									<select-file v-if="typeFileSelected === 'PPN'" v-model="fileFinalSelected" :is-loading="isLoading" @deleted="deleteDemande()"
										>Charger le fichier des exemplaires à supprimer
									</select-file>
									<select-file v-else-if="typeFileSelected === 'EPN'" v-model="fileSelected" :is-loading="isLoading" typeFile="EPN" @deleted="deleteDemande()"
										>Selection du fichier EPN
									</select-file>
									<v-alert v-if="alertMessage" :type="alertType" :icon="alertType === 'error' ? 'mdi-alert' : null">
										<span v-html="alertMessage"></span>
									</v-alert>
									<v-container class="d-flex justify-space-between">
										<v-btn @click="prev()"> précédent </v-btn>
										<v-btn :disabled="!(fileFinalSelected || (fileSelected && typeFileSelected === 'EPN'))" @click="uploadFileFinal()" :loading="isLoading">
											Lancer le traitement en simulation
										</v-btn>
									</v-container>
								</v-container>
							</v-stepper-window-item>
							<v-stepper-window-item>
								<simulation
									v-if="currentStep === 3"
									:demande="demande"
									label-before="Exemplaire(s) existant(s)"
									label-after="Exemplaire(s) restant(s)"
									@deleted="deleteDemande()"
								></simulation>
								<v-container class="d-flex justify-space-between">
									<v-btn @click="prev"> précédent </v-btn>
									<v-btn large @click="dialog = true" aria-label="Lancer le traitement en production">Lancer le traitement en production </v-btn>
								</v-container>
							</v-stepper-window-item>
						</v-stepper-window>
					</v-stepper>
				</v-col>
			</v-row>
		</v-col>
	</v-container>
	<dialog-lancer-traitement
		v-model="dialog"
		:is-loading="isLoading"
		route="suppression-tableau"
		body="Le traitement de suppression  des exemplaires en base de production est irréversible."
		rubrique="Tableau des suppressions d'exemplaires"
		@launch="launchDemande()"
	></dialog-lancer-traitement>
	<dialog-suppression v-model="suppDialog" :demande="demande" return-to-accueil></dialog-suppression>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import TypeFile from '@/components/Supp/TypeFile.vue'
import SelectFile from '@/components/SelectFile.vue'
import itemService from '@/service/ItemService'
import DownloadFile from '@/components/DownloadFile.vue'
import router from '@/router'
import Rcr from '@/components/Rcr.vue'
import Simulation from '@/components/Simulation.vue'
import DialogLancerTraitement from '@/components/Dialog/DialogLancerTraitement.vue'
import DialogSuppression from '@/components/Dialog/DialogSuppression.vue'
import RecapDemande from '@/components/RecapDemande.vue'

const currentStep = ref(0)
const demande = ref({
	id: null,
	rcr: '',
	typeExemp: '',
	etatDemande: '',
	type: 'SUPP'
})

const emits = defineEmits(['backendError', 'backendSuccess'])
const props = defineProps({id: {type: String}})

const rcrSelected = ref()
const typeFileSelected = ref('')
const fileFinalSelected = ref()
const fileSelected = ref()
const fileLink = ref('')
const fileName = ref('')
const isLoaded = ref(false)
const isDownloaded = ref(false)
const isLoading = ref(false)
const alertMessage = ref('')
const alertType = ref('success')
const dialog = ref(false)
const suppDialog = ref(false)

watch(router.currentRoute, newValue => {
	if (newValue.fullPath.includes('empty')) {
		cleanPath()
		raz()
		currentStep.value = 1
		prev()
	}
})

onMounted(() => {
	if (props.id !== 'empty' && props.id != null) {
		itemService
			.getDemande(props.id, 'SUPP')
			.then(response => {
				demande.value = response.data
				switch (demande.value.etatDemande) {
					case 'En préparation':
						currentStep.value = 1
						rcrSelected.value = demande.value.rcr
						if (demande.value.typeSuppression) {
							typeFileSelected.value = demande.value.typeSuppression
							if (demande.value.typeSuppression === 'EPN') {
								currentStep.value = 2
							}
						}
						break
					case 'Préparée':
						rcrSelected.value = demande.value.rcr
						typeFileSelected.value = demande.value.typeSuppression
						currentStep.value = 1
						break
					case 'A compléter':
						rcrSelected.value = demande.value.rcr
						typeFileSelected.value = demande.value.typeSuppression
						currentStep.value = 2
						break
					case 'En simulation':
						rcrSelected.value = demande.value.rcr
						typeFileSelected.value = demande.value.typeSuppression
						currentStep.value = 3
						break
				}
			})
			.catch(() => {
				router.replace('/suppression')
			})
	} else {
		cleanPath()
	}
})

function cleanPath() {
	if (router.currentRoute.value.fullPath.includes('empty')) {
		router.replace('/suppression')
		router.currentRoute.value.fullPath = '/suppression'
	}
}

function createDemande() {
	// Si la demande existe déjà et le RCR est le même
	if (demande.value?.id && rcrSelected.value === demande.value.rcr) {
		next()
	}
	// Si la demande existe et le RCR est différent
	else if (demande.value?.id) {
		isLoading.value = true
		itemService
			.modifierRcrDemande(demande.value.id, rcrSelected.value, 'SUPP')
			.then(response => {
				demande.value = response.data
				next()
			})
			.catch(err => {
				emits('backendError', err)
			})
			.finally(() => {
				isLoading.value = false
			})
	}
	// Si c'est une nouvelle demande
	else {
		isLoading.value = true
		itemService
			.creerDemande(rcrSelected.value, 'SUPP')
			.then(response => {
				demande.value = response.data
				router.replace(`/suppression/${demande.value.id}`)
				next()
			})
			.catch(err => {
				emits('backendError', err)
			})
			.finally(() => {
				isLoading.value = false
			})
	}
}

function uploadFile() {
	alertMessage.value = ''
	alertType.value = 'success'
	isLoading.value = true
	itemService
		.uploadDemande(demande.value.id, fileSelected.value, 'SUPP')
		.then(() => {
			alertMessage.value = 'Fichier envoyé'
			itemService.getFile(demande.value.id, 'SUPP', 'fichier_correspondance', '.csv').then(response => {
				let blob = new Blob([response.data], {type: 'application/csv'})
				fileLink.value = window.URL.createObjectURL(blob)
				fileName.value = `fichier_demande_${demande.value.id}.csv`
				isLoaded.value = true
				alertMessage.value = 'Fichier PPN:RCR:EPN disponible'
			})
		})
		.catch(err => {
			alertMessage.value = err.response.data.message
			alertType.value = 'error'
		})
		.finally(() => {
			isLoading.value = false
		})
}

function setTypeSelected() {
	itemService.modifierTypeFileDemande(demande.value.id, typeFileSelected.value)
	if (typeFileSelected.value === 'EPN') {
		next()
	}
}

function uploadFileFinal() {
	alertMessage.value = ''
	alertType.value = 'info'
	isLoading.value = true
	if (typeFileSelected.value === 'PPN') {
		itemService
			.uploadDemande(demande.value.id, fileFinalSelected.value, demande.value.type)
			.then(() => {
				alertMessage.value = 'Fichier envoyé'
				itemService.getDemande(demande.value.id, demande.value.type).then(response => {
					demande.value = response.data
				})
				next()
			})
			.catch(err => {
				alertMessage.value = err.response.data.message
				alertType.value = 'error'
			})
			.finally(() => {
				isLoading.value = false
			})
	} else if (typeFileSelected.value === 'EPN') {
		itemService
			.uploadDemande(demande.value.id, fileSelected.value, demande.value.type)
			.then(() => {
				alertMessage.value = 'Fichier envoyé, veuillez patienter quelques instants.'
				itemService
					.getFile(demande.value.id, 'SUPP', 'fichier_correspondance', '.csv')
					.then(response => {
						let blob = new Blob([response.data], {type: 'application/csv'})
						itemService
							.uploadDemande(demande.value.id, blob, demande.value.type)
							.then(() => {
								goSimulation()
							})
							.catch(err => {
								alertMessage.value = err.response.data.message
								alertType.value = 'error'
							})
							.finally(() => {
								isLoading.value = false
							})
					})
					.catch(err => {
						alertMessage.value = err.response.data.message
						alertType.value = 'error'
						isLoading.value = false
					})
			})
			.catch(err => {
				alertMessage.value = err.response.data.message
				alertType.value = 'error'
				isLoading.value = false
			})
	}
}

function changeEtape() {
	if (currentStep.value + 1 === 1 || (currentStep.value + 1 === 2 && !typeFileSelected.value)) {
		itemService.choixEtape(demande.value.id, 1, 'SUPP').then(response => {
			demande.value = response.data
		})
		typeFileSelected.value = null
	}
	if (currentStep.value + 1 === 2 && typeFileSelected.value) {
		//Changement d'etat pour le chargement du fichier car le back est perdu sinon
		if (typeFileSelected.value === 'EPN') {
			typeFileSelected.value = null
		}
		itemService.choixEtape(demande.value.id, 2, 'SUPP').then(response => {
			demande.value = response.data
		})
	}
	if (currentStep.value + 1 === 3) {
		if (typeFileSelected.value === 'EPN') {
			itemService.choixEtape(demande.value.id, 2, 'SUPP').then(response => {
				demande.value = response.data
			})
		} else {
			itemService.choixEtape(demande.value.id, 3, 'SUPP').then(response => {
				demande.value = response.data
			})
		}
	}
}

function prevSelectTypeFile() {
	typeFileSelected.value = null
	changeEtape()
	raz()
}

function prevSelectFile() {
	changeEtape()
	raz()
}

function next() {
	currentStep.value++
	raz()
}

function goSimulation() {
	currentStep.value = 3
	raz()
}

function prev() {
	currentStep.value--
	changeEtape()
	raz()
}

function raz() {
	isLoading.value = false
	alertMessage.value = ''
	alertType.value = 'success'
	isLoaded.value = false
	isDownloaded.value = false
}

function launchDemande() {
	isLoading.value = true
	itemService
		.lancerDemande(demande.value.id, 'SUPP')
		.then(response => {
			demande.value = response.data
		})
		.finally(() => {
			isLoading.value = false
		})
}

function deleteDemande() {
	suppDialog.value = true
}
</script>
