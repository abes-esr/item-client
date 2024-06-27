<template>
  <recap-demande :demande="demande"></recap-demande>

  <!-- CONTENU SIMULATION -->
  <v-card>
    <v-card-title  style="background-color: #295494; color: white">
      <span>Ecran de simulation</span>
    </v-card-title>
    <!--TEMPLATE DE SIMULATION-->
    <div>
      <v-row no-gutters>
        <v-col :key="1" cols="12" sm="12" style="margin-top: 1em">
          <!--Message de visualisation de la simulation-->
          <v-alert type="warning" dense prominent border="left">
            Cet écran est une <strong>prévisualisation</strong> du traitement.<br>
            Il s'agit de la <strong>dernière étape</strong> avant de lancer le traitement en <strong>base de
            production</strong>. Merci de <strong>vérifier vos données</strong>.
          </v-alert>
        </v-col>
        <v-col :key="2" cols="12" sm="12"> <!--Ligne du fichier-->
          <v-card class="pa-1" outlined tile>
                  <span class="headline mb-0" id="numLigne">Ligne de votre fichier : {{
                      noticeEnCours + 1
                    }} sur {{ numberLines }}</span>
          </v-card>
        </v-col>
        <v-col :key="3" cols="12" sm="12"> <!--PPN de la notice en cours-->
          <v-card class="pa-1" elevation="0">
                  <span class="headline mb-0" v-if="this.numeroPPNNotice !== ''">PPN n° {{
                      this.numeroPPNNotice
                    }}</span>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col :key="1" cols="12" sm="12" md="5"> <!--Exemplaires existants-->
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
        <v-col :key="2" cols="12" sm="12" md="2"> <!--Boutons de navigation-->
          <!--Conteneur bouton 1-->
          <v-card flat class="item-vertical-padding">
            <v-btn v-if="noticeEnCours === 0" color="disabled" depressed large dark
                   aria-label="Première notice" class="unhover">
              <v-icon>first_page</v-icon>
            </v-btn>
            <v-btn v-if="noticeEnCours > 0" color="success" large dark @click="getFirstSimu()"
                   aria-label="Première notice">
              <v-icon>first_page</v-icon>
            </v-btn>
            <div>Première <br>notice</div>
          </v-card>
          <!--Conteneur bouton 2-->
          <v-card flat class="item-vertical-padding">
            <v-btn v-if="noticeEnCours === 0" color="disabled" depressed large dark
                   aria-label="Notice précédente" class="unhover">
              <v-icon>navigate_before</v-icon>
            </v-btn>
            <v-btn v-if="noticeEnCours > 0" color="success" large dark
                   @click="getPreviousSimu()" aria-label="Notice précédente">
              <v-icon>navigate_before</v-icon>
            </v-btn>
            <div>Notice <br>précédente</div>
          </v-card>
          <!--Conteneur bouton 3-->
          <v-card flat class="item-vertical-padding">
            <v-btn v-if="noticeEnCours === numberLines - 1" color="disabled" depressed large
                   dark aria-label="Notice suivante" class="unhover">
              <v-icon>navigate_next</v-icon>
            </v-btn>
            <v-btn v-if="noticeEnCours !== numberLines - 1" color="success" large dark
                   @click="getNextSimu()" aria-label="Notice suivante">
              <v-icon>navigate_next</v-icon>
            </v-btn>
            <div>Notice <br>suivante</div>
          </v-card>
          <!--Conteneur bouton 4-->
          <v-card flat class="item-vertical-padding">
            <v-btn v-if="noticeEnCours === numberLines - 1" color="disabled" depressed large
                   dark aria-label="Dernière notice" class="unhover">
              <v-icon>last_page</v-icon>
            </v-btn>
            <v-btn v-if="noticeEnCours !== numberLines - 1" color="success" large dark
                   @click="getLastSimu()" aria-label="Dernière notice">
              <v-icon>last_page</v-icon>
            </v-btn>
            <div>Dernière <br>notice</div>
          </v-card>
        </v-col>
        <v-col :key="3" cols="12" sm="12" md="5"> <!--Exemplaire à créer-->
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
    </div>
  </v-card>
</template>

<script setup>

import RecapDemande from "@/components/RecapDemande.vue";

const props = defineProps({
  demande: {
    type: Object,
    required: true
  }
})
</script>
