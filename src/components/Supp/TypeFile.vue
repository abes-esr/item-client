<template>
	<v-card flat :loading="isLoading">
		<v-card-title class="d-flex justify-space-between custom-card-title">
			<span>Choix du type de fichier</span>
			<v-btn depressed variant="text" @click="deleted()" prepend-icon="mdi-delete">Supprimer</v-btn>
		</v-card-title>
		<v-card-text class="pa-0 ma-0">
			<v-overlay v-if="isLoading" v-model="overlay" class="justify-center align-center" contained>
				<v-progress-circular color="info" indeterminate></v-progress-circular>
			</v-overlay>
			<v-row justify="space-between" class="mt-4 mb-4 ml-1 mr-1">
        <!--    Création des boutons    -->
				<v-hover v-slot="{isHovering, props}" v-for="type in types" :key="type">
					<v-col>
						<v-row class="pl-1">
              <span style="font-size: 1.3em; font-weight: 500; color: #326bb1">{{ type.message }}</span>
						</v-row>
						<v-row>
							<v-col v-bind="props" :class="`btn-perso d-flex justify-center elevation-${isHovering ? 6 : 2} pa-5 ma-1 d-flex`" @click="onClick(type.type)">
								<v-row class="align-center">
									<v-col cols="12" sm="3" class="d-flex justify-center">
										<v-icon size="x-large" dark color="primary"> mdi-file-document-outline </v-icon>
									</v-col>
									<v-col cols="12" sm="9" class="d-flex justify-start">
										<span class="group large-text">Fichier {{ type.type }}</span>
									</v-col>
								</v-row>
							</v-col>
						</v-row>
					</v-col>
          <!--     Placement d'une barre à droite de chaque bouton s'il ne sagit pas du dernier     -->
          <div class="ml-3 mr-1" v-if="types.indexOf(type) < types.length-1" style="width: 10px; border-left: solid 4px #295494"></div>
				</v-hover>
			</v-row>
    </v-card-text>
	</v-card>
</template>
<script setup>

import { ref } from 'vue';

const emits = defineEmits(['clicked','deleted'])
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})
const model = defineModel()
const types = [
	{type: 'PPN', message: 'Numéro de notice :'},
	{type: 'EPN', message: "Numéro d'exemplaire :"}
]
const overlay = ref(true)

function onClick(type) {
  model.value = type;
  emits('clicked')
}

function deleted() {
  emits('deleted');
}

</script>

<style scoped>
.large-text {
  font-size: 1.1rem;
  font-weight: bold;
}
</style>
