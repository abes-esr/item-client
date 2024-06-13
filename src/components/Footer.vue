<template>
	<v-footer height="40" app>
		<a @click="toggleDrawer"><v-icon color="grey">mdi-cog</v-icon></a>

		<div class="text-caption text-disabled" style="position: absolute; right: 16px">{{ currentYear }} <span class="d-none d-sm-inline-block">- ABES</span></div>
	</v-footer>
	<v-navigation-drawer v-model="drawer" class="mt-6 border-none">
		<v-list-item title="Détails application"
			><v-chip variant="text">Interface :</v-chip><br /><v-chip variant="text">API Item :</v-chip><br /><v-chip variant="text">Batch ITEM :</v-chip><br /><v-chip variant="text"
				>Accès CBS :</v-chip
			></v-list-item
		>
		<v-divider></v-divider>
		<v-list-item title="Etat des serveurs">
			<v-chip :color="chipColorCbsBaseStatus" variant="text"><v-icon icon="mdi-server" start></v-icon>Serveur CBS</v-chip>
			<v-chip :color="chipColorItemBaseStatus" variant="text"><v-icon icon="mdi-server" start></v-icon>Base XML</v-chip>
			<v-chip :color="chipColorXmlBaseStatus" variant="text"><v-icon icon="mdi-server" start></v-icon>Base ITEM</v-chip>
		</v-list-item>
		<v-divider></v-divider>
		<v-list-item title="Données personnelles"></v-list-item>
		<v-list-item title="Conditions générales (CGU)" @click="redirection('https://abes.fr/pages-cgu/conditions-generales-utilisation-sites-abes.html')"></v-list-item>
		<v-list-item title="Mentions légales"></v-list-item>
		<v-list-item title="Accesibilité numérique" @click="redirection('https://abes.fr/pages-accessibilite/item.sudoc.html')"></v-list-item>
		<v-divider></v-divider>
	</v-navigation-drawer>
</template>

<script setup>
import {ref, computed} from 'vue'
const items = [
	{
		title: 'Détails application',
		href: 'https://vuetifyjs.com/'
	},
	{
		title: 'Etat des serveurs',
		href: 'https://support.vuetifyjs.com/'
	},
	{
		title: 'Données personnelles',
		href: 'https://github.com/vuetifyjs/vuetify'
	},
	{
		title: "Conditions générales d'utilisation",
		href: 'https://github.com/vuetifyjs/vuetify'
	},
	{
		title: 'Mentions légales',
		href: 'https://community.vuetifyjs.com/'
	},
	{
		title: 'Accessibilité numérique',
		href: 'https://reddit.com/r/vuetifyjs'
	}
]
const drawer = ref(false)
const chipColorCbsBaseStatus = ref('green')
const chipColorItemBaseStatus = ref('green')
const chipColorXmlBaseStatus = ref('red')
const currentYear = computed(() => new Date().getFullYear())
const toggleDrawer = () => {
	drawer.value = !drawer.value
}
const checkServiceAvailable = () => {
	//TODO integrer appel au service de controle de dispo des Bases
	//alimenter chipColorCbsBaseStatus chipColorItemBaseStatus chipColorXmlBaseStatus
	//rafraichir toutes les 20 secondes
}
const redirection = externalUrl => {
	window.open(externalUrl, '_blank')
}
</script>

<style scoped lang="sass">
.social-link :deep(.v-icon)
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
  text-decoration: none
  transition: .2s ease-in-out

  &:hover
    color: rgba(25, 118, 210, 1)
</style>
