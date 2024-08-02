<template>
	<v-app-bar color="primary" max-height="4.2em" dark elevate-on-scroll="false">
    <!--Marge à gauche des icones de la barre de navigation-->
		<div class="item-margin-left-app-bar"></div>
    <!--Bouton hamburger-->
		<v-app-bar-nav-icon @click="toggleDrawer" aria-label="menu latéral" v-if="authenticated" class="ml-4">
			<v-icon large>mdi-menu</v-icon>
		</v-app-bar-nav-icon>
    <!--Icone et titre de l'application-->
		<img alt="icone assistance" height="41px" v-on:click="$router.push({path: '/'})" src="../../assets/item_logo.svg" target="_blank" width="41px" style="margin-left: 1em" />
		<v-toolbar-title class="item-margin-left-icon" v-on:click="$router.push({path: '/'})">Item</v-toolbar-title>
		<!--Icones de la barre de menu à droite-->
		<div class="flex-grow-1"></div>
		<div class="item-margin-around-single-icon">
			<v-btn class="mx-2 item-margin-around-single-icon" fab dark small color="primary">
				<span
					><a href="https://stp.abes.fr/node/3?origine=sudocpro" title="Assistance" rel="noopener" target="_blank"
						><img
							alt="icone assistance"
							height="41px"
							href="https://stp.abes.fr/node/3?origine=sudocpro"
							src="../../assets/item_assistance.svg"
							target="_blank"
							width="41px"
							style="transform: translateY(-3px)" /></a
				></span>
			</v-btn>
		</div>
		<div class="item-margin-around-single-icon">
			<v-btn class="mx-2 item-margin-around-single-icon" fab dark small color="primary">
				<span
					><a href="http://documentation.abes.fr/aideitem/index.html" title="Documentation" rel="noopener" target="_blank"
						><img
							alt="icone documentation"
							height="41px"
							href="http://documentation.abes.fr/aideitem/index.html"
							src="../../assets/item_documentation.svg"
							target="_blank"
							width="41px"
							style="transform: translateY(-3px)" /></a
				></span>
			</v-btn>
		</div>
		<div class="item-margin-around-single-icon">
			<v-btn class="mx-2 item-margin-around-single-icon" fab dark small color="primary" v-if="authenticated">
				<span @click="logout()" title="Déconnexion"
					><a><img alt="icone déconnexion" height="41px" src="../../assets/item_deconnexion.svg" width="41px" /></a
				></span>
			</v-btn>
		</div>
    <!--Marge à droite des icones de la barre de navigation-->
		<div class="item-margin-right-app-bar"></div>
	</v-app-bar>
</template>

<script setup>
import itemService from '@/service/ItemService'
import {useAuthStore} from '@/store/authStore'
import {computed} from 'vue'

const emit = defineEmits(['logout-success', 'toggle-drawer'])

const authStore = useAuthStore()

const authenticated = computed(() => {
  return authStore.isAuthenticated
})

function logout() {
  authStore.logout()
  itemService.logout()
  emit('logout-success')
}

function toggleDrawer() {
  emit('toggle-drawer');
}
</script>
