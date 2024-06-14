<template>
	<v-container class="fill-height">
		<v-responsive class="align-centerfill-height mx-auto">
			<div class="py-4" />
			<v-row>
        <v-col cols="12" md="6" class="text-center">
          <v-card
            class="py-4"
            color="surface-variant"
            @click="console.log('router.push(Calcul du taux de recouvrement)')"
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
            @click="router.push('recouvrementTableau')"
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
				<v-col cols="12" md="6" class="text-center">
					<v-card
						class="py-4"
						color="surface-variant"
						@click="console.log('router.push(Créer de nouveaux exemplaires)')"
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
            @click="router.push('exemplarisationTableau')"
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
            @click="console.log('router.push(Modifier des exemplaires)')"
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
            @click="router.push('modificationTableau')"
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
			</v-row>
		</v-responsive>
	</v-container>
</template>

<script setup>
import router from "@/router"

//
</script>
