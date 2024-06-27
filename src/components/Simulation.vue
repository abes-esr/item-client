<template>
  <recap-demande :demande="demande"></recap-demande>

  <!-- CONTENU SIMULATION -->
  <v-card>
    <v-card-title style="background-color: #295494; color: white">
      <span>Ecran de simulation</span>
    </v-card-title>
    <!--TEMPLATE DE SIMULATION-->
    <v-alert type="warning" align="center" class="my-3 pa-2" dense prominent border="left">
      Cet écran est une <strong>prévisualisation</strong> du traitement.<br>
      Il s'agit de la <strong>dernière étape</strong> avant de lancer le traitement en <strong>base de
      production</strong>. Merci de <strong>vérifier vos données</strong>.
    </v-alert>
    <h3 class="d-flex justify-center" style="border: 1px solid lightgrey">Ligne de votre fichier :
      {{ nbNotice.nbNoticeEnCours + 1 }} sur {{ nbNotice.nbTotalNotice }}</h3>
    <h4 class="d-flex justify-center" v-if="numeroPPNNotice">PPN n° {{ numeroPPNNotice }}</h4>
    <v-row class="pt-5">
      <v-col cols="12" sm="12" md="5"> <!--Exemplaires existants-->
        <!--Carte activée si présence exemplaires pour cette notice-->
        <v-card class="pa-1" outlined tile>
          <span class="headline --text">Exemplaire(s) existant(s)</span>
          <v-container id="scroll-target" style="max-height: 400px" class="overflow-y-auto">
            <div class="notice">
              <pre style="text-align: left; padding-top: 1em">
                <span class="inner-pre" style="text-align: left; padding-top: 1em; overflow-x:scroll;">
                    {{ noticeAvant }}
                </span>
              </pre>
            </div>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="2" class="pb-10">
        <navigate-notice v-model="nbNotice"></navigate-notice>
      </v-col>
      <v-col cols="12" sm="12" md="5"> <!--Exemplaire à créer-->
        <v-card class="pa-1" outlined tile>
          <span class="headline --text">Exemplaire à créer</span>
          <div class="notice">
            <br>
            <pre style="text-align: left; padding-top: 1em; overflow-x:scroll;">
                    {{ noticeApres }}
                  </pre>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>

import RecapDemande from "@/components/RecapDemande.vue";
import NavigateNotice from "@/components/NavigateNotice.vue";
import {ref} from "vue";

const props = defineProps({
  demande: {
    type: Object,
    required: true
  }
})

const nbNotice = ref({
  nbNoticeEnCours: 0,
  nbTotalNotice: 5
})
const numeroPPNNotice = ref("123456789")

</script>

<style>
h3 {
  font-size: x-large;
  font-weight: normal;
}
</style>
