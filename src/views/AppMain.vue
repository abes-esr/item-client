<template>
	<v-container class="fill-height">
		<v-responsive class="align-centerfill-height mx-auto">
			<div class="py-4" />

			<v-row>
				<v-col cols="12" v-if="false">
					<v-card
						class="py-4"
						color="surface-variant"
						image="https://cdn.vuetifyjs.com/docs/images/one/create/feature.png"
						prepend-icon="mdi-check-outline"
						rounded="lg"
						variant="outlined"
					>
						<template #image>
							<v-img position="top right" />
						</template>

						<template #title>
							<h2 class="text-h5 font-weight-bold">Etat du service</h2>
						</template>

						<template #subtitle>
							<div class="text-subtitle-1">Le service est fonctionnel.</div>
						</template>

						<v-overlay opacity=".12" scrim="primary" contained model-value persistent />
					</v-card>
				</v-col>

				<v-col cols="12" md="6" class="text-center">
					<v-card
						class="py-4"
						color="surface-variant"
						href="https://vuetifyjs.com/"
						prepend-icon="mdi-plus"
						rel="noopener noreferrer"
						rounded="lg"
						subtitle="Créer de nouveaux exemplaires"
						target="_blank"
						title="Exemplarisation"
						variant="text"
					>
						<v-overlay opacity=".06" scrim="primary" contained model-value persistent />
					</v-card>
				</v-col>
				<v-col cols="12" md="6" class="text-center">
					<v-card
						class="py-4"
						color="surface-variant"
						:href="'/exemplarisationTableau'"
						prepend-icon="mdi-chart-bar"
						rel="noopener noreferrer"
						rounded="lg"
						subtitle="Gérer ses exemplarisations"
						title="Exemplarisation"
						variant="text"
					>
						<v-overlay opacity=".06" scrim="primary" contained model-value persistent />
					</v-card>
				</v-col>

				<v-col cols="12" md="6" class="text-center">
					<v-card
						class="py-4"
						color="surface-variant"
            :href="'/modificationNouvelleDemande'"
						prepend-icon="mdi-pencil"
						rel="noopener noreferrer"
						rounded="lg"
						subtitle="Modifier des exemplaires"
						title="Modification"
						variant="text"
					>
						<v-overlay opacity=".06" scrim="primary" contained model-value persistent />
					</v-card>
				</v-col>
				<v-col cols="12" md="6" class="text-center">
					<v-card
						class="py-4"
						color="surface-variant"
            :href="'/modificationTableau'"
						prepend-icon="mdi-chart-bar"
						rel="noopener noreferrer"
						rounded="lg"
						subtitle="Gérer ses modifications"
						title="Modification"
						variant="text"
					>
						<v-overlay opacity=".06" scrim="primary" contained model-value persistent />
					</v-card>
				</v-col>

				<v-col cols="12" md="6" class="text-center">
					<v-card
						class="py-4"
						color="surface-variant"
						href="https://discord.vuetifyjs.com"
						prepend-icon="mdi-percent"
						rel="noopener noreferrer"
						rounded="lg"
						subtitle="Calcul du taux de recouvrement"
						target="_blank"
						title="Recouvrement"
						variant="text"
					>
						<v-overlay opacity=".06" scrim="primary" contained model-value persistent />
					</v-card>
				</v-col>
				<v-col cols="12" md="6" class="text-center">
					<v-card
						class="py-4"
						color="surface-variant"
            :href="'/recouvrementTableau'"
						prepend-icon="mdi-chart-bar"
						rel="noopener noreferrer"
						rounded="lg"
						subtitle="Gérer ses taux de recouvrement"
						title="Recouvrement"
						variant="text"
					>
						<v-overlay opacity=".06" scrim="primary" contained model-value persistent />
					</v-card>
				</v-col>
			</v-row>
		</v-responsive>
	</v-container>
</template>

<script setup>
//
</script>
