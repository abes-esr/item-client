<template>
	<v-app-bar color="primary" max-height="4.2em" dark elevate-on-scroll="false">
		<div class="item-margin-left-app-bar"></div>
		<!--Marge à gauche des icones de la barre de navigation-->
		<v-app-bar-nav-icon @click.stop="drawer = !drawer" aria-label="menu latéral" v-if="authenticated" class="ml-4">
			<v-icon large>mdi-menu</v-icon>
		</v-app-bar-nav-icon>
		<img alt="icone assistance" height="41px" v-on:click="$router.push({path: '/'})" src="../assets/item_logo.svg" target="_blank" width="41px" style="margin-left: 1em" />
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
							src="../assets/item_assistance.svg"
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
							src="../assets/item_documentation.svg"
							target="_blank"
							width="41px"
							style="transform: translateY(-3px)" /></a
				></span>
			</v-btn>
		</div>
		<div class="item-margin-around-single-icon">
			<v-btn class="mx-2 item-margin-around-single-icon" fab dark small color="primary" v-if="authenticated">
				<span @click="logout()" title="Déconnexion"
					><a><img alt="icone déconnexion" height="41px" src="../assets/item_deconnexion.svg" width="41px" /></a
				></span>
			</v-btn>
		</div>
		<div class="item-margin-right-app-bar"></div>
		<!--Marge à droite des icones de la barre de navigation-->
	</v-app-bar>
	<!--BARRE LATERALE DE MENU remplacer false par authenticated-->
	<v-navigation-drawer width="18em" app v-if="false" v-model="drawer" temporary>
		<v-list-item three-line>
			<v-list-item>
				<v-list-item-title class="title wrap-text">
					{{ user.username }}
				</v-list-item-title>
				<v-list-item-subtitle class="wrap-text">
					<span v-if="!isAdmin"
						>Vous êtes habilité à intervenir<br />
						sur les exemplaires des RCR de<br />
						l'ILN {{ user.iln }}</span
					>
					<span v-else>Vous disposez des permissions <br />administrateur</span>
				</v-list-item-subtitle>
			</v-list-item>
		</v-list-item>

		<v-divider></v-divider>

		<v-list dense nav>
			<v-list-item v-on:click="$router.push({name: 'home'}).catch(err => {})">
				<v-list-item-action>
					<v-icon>home</v-icon>
				</v-list-item-action>
				<v-list-item>
					<v-list-item-title>Accueil</v-list-item-title>
				</v-list-item>
			</v-list-item>
			<v-list-item v-on:click="$router.push({name: 'profil'}).catch(err => {})">
				<v-list-item-action>
					<v-icon>mail_outline</v-icon>
				</v-list-item-action>
				<v-list-item>
					<v-list-item-title>Modifier mon adresse mail</v-list-item-title>
				</v-list-item>
			</v-list-item>
			<v-list-item v-on:click="saveTheme()">
				<v-switch v-model="$vuetify.theme.dark" style="margin-top: 8px" inset></v-switch>
				<v-list-item-title style="padding-bottom: 1.2em">Changer de thème</v-list-item-title>
			</v-list-item>
		</v-list>

		<v-divider></v-divider>

		<v-list dense nav>
			<v-list-item>
				<v-list-item-title class="title"> Recouvrement </v-list-item-title>
			</v-list-item>
			<v-list-item v-on:click="$router.push({name: 'rcrRecouv'}).catch(err => {})">
				<v-list-item-action>
					<v-icon>mdi-percent</v-icon>
				</v-list-item-action>
				<v-list-item>
					<v-list-item-title>Calculer mon taux <br />de recouvrement</v-list-item-title>
				</v-list-item>
			</v-list-item>
			<v-list-item v-on:click="$router.push({name: 'tabRecouv'}).catch(err => {})">
				<v-list-item-action>
					<v-icon>list</v-icon>
				</v-list-item-action>
				<v-list-item>
					<v-list-item-title>Gérer mes taux<br />de recouvrement</v-list-item-title>
				</v-list-item>
			</v-list-item>
			<v-list-item v-on:click="$router.push({name: 'archiveRecouv'}).catch(err => {})">
				<v-list-item-action>
					<v-icon>archive</v-icon>
				</v-list-item-action>
				<v-list-item>
					<v-list-item-title>Gérer mes taux<br />de recouvrement archivés</v-list-item-title>
				</v-list-item>
			</v-list-item>
		</v-list>

		<v-divider></v-divider>

		<v-list dense nav>
			<v-list-item>
				<v-list-item-title class="title"> Creations </v-list-item-title>
			</v-list-item>
			<v-list-item v-on:click="$router.push({name: 'rcrEx'}).catch(err => {})">
				<v-list-item-action>
					<v-icon>edit</v-icon>
				</v-list-item-action>
				<v-list-item>
					<v-list-item-title>Créer des exemplaires</v-list-item-title>
				</v-list-item>
			</v-list-item>
			<v-list-item v-on:click="$router.push({name: 'tabExemp'}).catch(err => {})">
				<v-list-item-action>
					<v-icon>list</v-icon>
				</v-list-item-action>
				<v-list-item>
					<v-list-item-title>Gérer mes créations</v-list-item-title>
				</v-list-item>
			</v-list-item>
			<v-list-item v-on:click="$router.push({name: 'archiveEx'}).catch(err => {})">
				<v-list-item-action>
					<v-icon>archive</v-icon>
				</v-list-item-action>
				<v-list-item>
					<v-list-item-title>Gérer mes créations<br />archivées</v-list-item-title>
				</v-list-item>
			</v-list-item>
		</v-list>

		<v-divider></v-divider>

		<v-list dense nav>
			<v-list-item>
				<v-list-item-title class="title"> Modifications </v-list-item-title>
			</v-list-item>
			<v-list-item v-on:click="$router.push({name: 'rcr'}).catch(err => {})">
				<v-list-item-action>
					<v-icon>edit</v-icon>
				</v-list-item-action>
				<v-list-item>
					<v-list-item-title>Modifier des exemplaires</v-list-item-title>
				</v-list-item>
			</v-list-item>
			<v-list-item v-on:click="$router.push({name: 'tabModif'}).catch(err => {})">
				<v-list-item-action>
					<v-icon>list</v-icon>
				</v-list-item-action>
				<v-list-item>
					<v-list-item-title>Gérer mes modifications</v-list-item-title>
				</v-list-item>
			</v-list-item>
			<v-list-item v-on:click="$router.push({name: 'archive'}).catch(err => {})">
				<v-list-item-action>
					<v-icon>archive</v-icon>
				</v-list-item-action>
				<v-list-item>
					<v-list-item-title>Gérer mes modifications<br />archivées</v-list-item-title>
				</v-list-item>
			</v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>

<script setup>
import DemandesService from '@/service/DemandesService'

const emit = defineEmits(['logout-success'])

defineProps({
  authenticated: {
    type: Boolean,
    required: true,
  },
})

function logout () {
  DemandesService.logout()
  emit('logout-success')
}


</script>
