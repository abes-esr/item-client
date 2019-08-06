<template>
    <!-- DESCRIPTION
    APPARAIT DANS LE FOOTER AGGRANDIT SUR LA PAGE DE LOGIN UNIQUEMENT -->
    <v-card flat tile class="primary">
        <v-container>
            <v-row  >
                <v-col cols="6">
                    <v-card-text class="white--text pt-0 text-left">
                        Cette application est à destination des coordinateurs du réseau Sudoc.
                        Elle permet la modification en masse des données d'exemplaire d'un RCR pour un ILN donné.
                        Ces traitements sont automatiquement répercutés dans les fichiers de transfert régulier.
                    </v-card-text>
                </v-col>
                <v-col cols="4">
                    <v-card-text class="white--text pt-0 text-left">
                        <span class="title">Assistance</span><br />
                        <a class="white--text pt-0 text-left" href="https://stp.abes.fr/node/3?origine=sudocpro" target="_blank" rel="noopener">Guichet ABESstp</a>
                    </v-card-text>
                </v-col>
                <v-col cols="1">
                    <v-row justify="end"><v-img :src="require('@/assets/logo-mesri.png')" alt="Logo Enseignement Supérieur" max-width="60"></v-img></v-row>
                </v-col>
                <v-col cols="1">
                    <v-row justify="end"><v-img :src="require('@/assets/abes.png')" alt="Logo ABES" max-width="110"></v-img></v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<style scoped>
    .v-card{
        padding-top: 20px;
    }
    a {
        text-decoration: none;
        margin-left: 20px;
    }
</style>
