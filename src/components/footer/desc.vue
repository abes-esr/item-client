<template>
    <v-card flat tile class="primary">
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex xs6>
                    <v-card-text class="white--text pt-0 text-xs-left">
                        Cette application est à destination des coordinateurs du réseau Sudoc.
                        Elle permet la modification en masse des données d'exemplaire d'un RCR pour un ILN donné.
                        Ces traitements sont automatiquement répercutés dans les fichiers de transfert régulier.
                    </v-card-text>
                </v-flex>
                <v-flex xs6>
                    <v-layout justify-end><v-img :src="require('@/assets/abes.png')" alt="Logo ABES" max-width="110"></v-img></v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<style scoped>
    .v-card{
        padding-top: 20px;
    }
</style>
