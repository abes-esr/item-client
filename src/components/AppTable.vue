<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col class="text-center" >
        <v-alert :type="alertType" :value="alert" dismissible transition="scale-transition">
          <span v-html="alertMessage"></span>
        </v-alert>
        <v-card :loading="tableLoading">
          <v-container>
            <v-row no-gutters>
              <!--Zone du titre du tableau-->
              <v-col cols="12" sm="12" md="4">
                <v-card-title class="title" v-if="archive && modif === 'MODIF'">Mes modifications archivées</v-card-title>
                <v-card-title class="title" v-if="!archive && modif === 'MODIF'">Gérer mes modifications</v-card-title>
                <v-card-title class="title" v-if="archive && modif === 'EXEMP'">Mes créations archivées</v-card-title>
                <v-card-title class="title" v-if="!archive && modif === 'EXEMP'">Gérer mes créations</v-card-title>
                <v-card-title class="title" v-if="archive && modif === 'RECOUV'">Mes taux de recouvrement archivées</v-card-title>
                <v-card-title class="title" v-if="!archive && modif === 'RECOUV'">Gérer mes taux de recouvrement</v-card-title>
              </v-col>
              <!--Zone de case à cocher pour affichage restrictif si administrateur uniquement en modif et admin-->
              <v-col cols="12" sm="12" md="8">
                <!--Zone de case à cocher pour affichage restrictif - tableaux classiques-->
                <div v-if="user.role === 'ADMIN'" class="item-flexbox-for-checkbox">
                  <div class="item-margin-right-app-bar">
                    <v-checkbox value="restrictDisplay" id="restrictDisplay" @click.native="switchRestrictionAffichage()" label="Affichage étendu"></v-checkbox>
                  </div>
                  <div class="item-margin-right-app-bar" style="margin-bottom: 0.5em">
                    <v-dialog v-model="popupAffichageRestrictif" persistent max-width="600">
                      <template v-slot:activator="{ on }">
                        <v-btn text small icon v-on="on">
                          <v-icon>info</v-icon>
                        </v-btn>
                      </template>
                      <v-card v-if="!archive">
                        <v-card-title class="headline">Affichage étendu</v-card-title>
                        <v-card-text>Permet en tant qu'administrateur de visualiser également sur <strong>tous les ILN</strong>, les demandes en statut : <br><br>
                          <v-chip color="grey" style="margin-right: 3px">En saisie</v-chip>
                          <v-chip color="orange" style="margin-right: 3px">En attente</v-chip>
                          <v-chip color="grey" style="margin-right: 3px">En cours de traitement</v-chip>
                          <v-chip color="green" style="margin-right: 3px">Terminé</v-chip>
                          <v-chip color="red">En erreur</v-chip>
                        </v-card-text>
                        <v-card-actions>
                          <div class="flex-grow-1"></div>
                          <v-btn text @click="popupAffichageRestrictif = false">Ok</v-btn>
                        </v-card-actions>
                      </v-card>
                      <v-card v-if="archive">
                        <v-card-title class="headline">Affichage étendu</v-card-title>
                        <v-card-text>Permet en tant qu'administrateur de visualiser également sur <strong>tous les ILN</strong>, les demandes archivées.
                        </v-card-text>
                        <v-card-actions>
                          <div class="flex-grow-1"></div>
                          <v-btn text @click="popupAffichageRestrictif = false">Ok</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <!--Ligne d'entête du tableau d'EXEMPLARISATION-->
          <v-data-table :custom-sort="customSort" :sort-by.sync="sortBy" :sort-desc.sync="descending" v-if="modif === 'EXEMP'" :headers="headers" :items="computedItems('guess')" :items-per-page="10" class="elevation-1" item-key="num" loading-text="chargement.." no-data-text="Aucune demande trouvée" no-results-text="Aucun resultat trouvé" :headers-length="3" :footer-props="{showFirstLastPage: true, itemsPerPageOptions:[10,25,-1], itemsPerPageAllText:'Toutes', itemsPerPageText:'Lignes par page'}">
            <!--Tableau d'exemplarisation-->
            <template v-slot:body="{ items }">
              <!--Ligne avec les champs de recherche : EXEMPLARISATION-->
              <thead>
              <tr>
                <!--COM--><th></th>
                <!--DEM--><th><v-text-field class="appropriateFontSize" append-icon="search" aria-label="Recherche par numéro" clear-icon='clear' clearable hide-details single-line v-model="searchNum" v-on:keyup="computedItems('num')"></v-text-field></th>
                <!--CRE--><th><v-text-field append-icon="search" aria-label="Recherche par date de création" clearable class="appropriateFontSize" hide-details single-line persistent-hint v-model="searchDateCreation" v-on:keyup="computedItems('dateCreation')"></v-text-field></th>
                <!--MAJ--><th><v-text-field append-icon="search" aria-label="Recherche par date de modification" clearable class="appropriateFontSize" hide-details single-line persistent-hint v-model="searchDateModification" v-on:keyup="computedItems('dateModification')"></v-text-field></th>
                <!--ILN--><th v-if="user.role === 'ADMIN'"><v-text-field class="appropriateFontSize" append-icon="search" aria-label="Recherche par ILN" clear-icon='clear' clearable hide-details single-line v-model="searchILN" v-on:keyup="computedItems('iln')"></v-text-field></th>
                <!--RCR--><th><v-text-field class="appropriateFontSize" append-icon="search" aria-label="Recherche par RCR" clear-icon='clear' clearable hide-details single-line v-model="searchRCR" v-on:keyup="computedItems('rcr')"></v-text-field></th>
                <!--TYP--><th><v-select :items="listTypeExemp" @change="computedItems('typeExemp')" aria-label="Recherche par type d'exemplarisation" clear-icon='clear' clearable item-text="libelle" item-value="libelle" no-data-text="Aucun type trouvé." v-model="searchTypeExemp" style="font-size:1.1em"></v-select></th>
                <!--IND--><th><v-text-field class="appropriateFontSize" append-icon="search" aria-label="Recherche par Index"  clear-icon='clear' clearable hide-details single-line v-model="searchIndexRecherche" v-on:keyup="computedItems('indexRecherche')"></v-text-field></th>
                <!--STA--><th v-if="!archive"><v-select :items="listStatut" @change="computedItems('statut')" aria-label="Recherche par statut" clear-icon='clear' clearable no-data-text="Aucun statut trouvé." v-model="searchStatut"></v-select></th>
                <!--TL1--><th></th>
                <!--AR2--><th></th>
              </tr>
              </thead>
              <!--Lignes de données : EXEMPLARISATION-->
              <tbody>
              <tr :key="item.name" v-for="item in items">
                <!--COM--><td><v-btn v-if="item.commentaire" icon color="primary" @click.stop="$set(dialogNote, item.num, true), fetchComment(item.commentaire)"><v-icon medium color="red">mdi-comment-text-outline</v-icon></v-btn><v-btn v-if="!item.commentaire" icon color="grey" @click.stop="$set(dialogNote, item.num, true), fetchComment(item.commentaire)"><v-icon medium>mdi-comment-text-outline</v-icon></v-btn><v-dialog v-model="dialogNote[item.num]" scrollable max-width="500" :key="item.num"><v-card><v-card-title><span>Note de la demande {{ item.num }}</span></v-card-title><v-card-text style="padding-top: 10px; margin-bottom: -25px;"><v-textarea v-model="commentaireMaj" outlined label="Commentaire"></v-textarea></v-card-text><v-card-actions><v-spacer></v-spacer><v-btn color="primary" @click.stop="$set(dialogNote, item.num, false); saveComment(item.num, commentaireMaj)">Enregistrer</v-btn></v-card-actions></v-card></v-dialog></td>
                <!--DEM--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.num }}</td>
                <td v-if="!item.isClickable">{{ item.num }}</td>
                <!--CRE--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.dateCreation }}</td>
                <td v-if="!item.isClickable">{{ item.dateCreation }}</td>
                <!--MAJ--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.dateModification }}</td>
                <td v-if="!item.isClickable">{{ item.dateModification }}</td>
                <!--ILN--><td v-if="item.isClickable && user.role === 'ADMIN'" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.iln }}</td>
                <td v-if="!item.isClickable && user.role === 'ADMIN'">{{ item.iln }}</td>
                <!--RCR--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.rcr }}</td>
                <td v-if="!item.isClickable">{{ item.rcr }}</td>
                <!--TYP--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.typeExemp }}</td>
                <td v-if="!item.isClickable">{{ item.typeExemp }}</td>
                <!--IND--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.indexRecherche }}</td>
                <td v-if="!item.isClickable">{{ item.indexRecherche }}</td>
                <!--STA--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">
                <v-chip :color="getColor(item.statut)" dark>{{ item.statut }}</v-chip> <!--Chip de statut-->
                <div v-if="item.codeStatut === 6">{{ item.percentOfProgression + ' %' }}</div> <!--% de progression quand la demande est en cours de traitement-->
              </td>
                <td v-if="!item.isClickable">
                  <v-chip :color="getColor(item.statut)" dark>{{ item.statut }}</v-chip>
                  <div style="float: right; margin-left: -2em; margin-top: 0.25em" v-if="item.codeStatut === 5 && item.indexRecherche === 'Date;Auteur;Titre'">
                    <v-tooltip bottom dark>
                      <template v-slot:activator="{ on }">
                        <v-icon color="orange"  dark v-on="on">info</v-icon>
                      </template>
                      <span>Les requêtes date;auteur;titre sont traitées entre 20h et 8h. (J+1)</span>
                    </v-tooltip>
                  </div>
                  <div v-if="item.codeStatut === 6">{{ item.percentOfProgression + ' %' }}</div>
                </td>
                <!--TL1--><td>
                <v-menu bottom left v-if="item.codeStatut >= 4"><template v-slot:activator="{ on }"><v-btn aria-label="Télécharger les fichiers" class="cloudButton" color="info" small v-on="on" title="Télécharger"><v-icon>cloud_download</v-icon></v-btn></template>
                  <!-- FICHIERS EXEMPLARISATION -->
                  <v-list v-if="item.codeStatut >= 4 && modif === 'EXEMP'">
                    <v-list-item @click="downloadFile(item.num, 'initEx')"><v-list-item-title>Télécharger le fichier déposé</v-list-item-title></v-list-item>
                    <v-list-item @click="downloadFile(item.num, 'resultatEx')" v-if="item.codeStatut >= 7 && item.codeStatut !== 8"><v-list-item-title>Télécharger le fichier résultat</v-list-item-title></v-list-item>
                  </v-list>
                </v-menu>
                <span v-if="item.codeStatut <= 3">
                  <v-btn aria-label="Téléchargement impossible" class="cloudButton" color="info" disabled small><v-icon>cloud_download</v-icon></v-btn>
                </span>
              </td>
                <!--AR2--><td class="text-center" v-if="!archive">
                <span v-if="(item.codeStatut < 5 && user.iln === item.iln) || (item.codeStatut < 5 && user.iln === '1')">
                      <v-btn @click="current = item.num; popupDelete = true;" aria-label="Supprimer" icon title="Supprimer"><v-icon>delete</v-icon></v-btn>
                </span>
                <span v-else-if="item.codeStatut === 7 && user.iln === item.iln">
                  <v-btn @click="current = item.num; popupArchive = true;" aria-label="Archiver" icon title="Archiver"><v-icon>archive</v-icon></v-btn>
                </span>
              </td>
                <!--Zone de commentaire associée à un item-->
              </tr>
              </tbody>
            </template>
          </v-data-table>
          <!--Ligne d'entête du tableau de MODIFICATION-->
          <v-data-table :custom-sort="customSort" :sort-by.sync="sortBy" :sort-desc.sync="descending" v-if="modif === 'MODIF'" :headers="headers" :items="computedItems('guess')" :items-per-page="10" class="elevation-1" item-key="num" loading-text="chargement.." no-data-text="Aucune demande trouvée" no-results-text="Aucun resultat trouvé" :headers-length="3" :footer-props="{showFirstLastPage: true, itemsPerPageOptions:[10,25,-1], itemsPerPageAllText:'Toutes', itemsPerPageText:'Lignes par page'}">
            <!--Tableau de modification-->
            <template v-slot:body="{ items }">
              <!--Ligne avec les champs de recherche : MODIFICATION-->
              <thead>
              <tr>
                <!--COM--><th></th>
                <!--DEM--><th><v-text-field append-icon="search" aria-label="Recherche par numéro" clear-icon='clear' clearable hide-details single-line v-model="searchNum" v-on:keyup="computedItems('num')"></v-text-field></th>
                <!--MAJ--><th><v-text-field append-icon="search" aria-label="Recherche par date de modification" class="appropriateFontSize" clearable hide-details single-line v-model="searchDateModification" v-on:keyup="computedItems('dateModification')"></v-text-field></th>
                <!--ILN--><th v-if="user.role === 'ADMIN'"><v-text-field class="appropriateFontSize" append-icon="search" aria-label="Recherche par ILN" clear-icon='clear' clearable hide-details single-line v-model="searchILN" v-on:keyup="computedItems('iln')"></v-text-field></th>
                <!--RCR--><th><v-text-field class="appropriateFontSize" append-icon="search" aria-label="Recherche par RCR"  clear-icon='clear' clearable hide-details single-line v-model="searchRCR" v-on:keyup="computedItems('rcr')"></v-text-field></th>
                <!--ZON--><th><v-text-field append-icon="search" aria-label="Recherche par zone et sous-zone" clear-icon='clear' clearable hide-details single-line v-model="searchZoneSousZone" v-on:keyup="computedItems('zoneSousZone')"></v-text-field></th>
                <!--TRT--><th><v-select :items="listTraitements" @change="computedItems('traitement')" aria-label="Recherche par type de traitement" clear-icon='clear' clearable item-text="libelle" item-value="libelle" no-data-text="Aucun type trouvé." v-model="searchTypeExemp"></v-select></th>
                <!--STA--><th v-if="!archive"><v-select :items="listStatut" @change="computedItems('statut')" aria-label="Recherche par statut" clear-icon='clear' clearable no-data-text="Aucun statut trouvé." v-model="searchStatut"></v-select></th>
                <!--TL1--><th></th>
                <!--AR2--><th></th>
              </tr>
              </thead>
              <!--Lignes de données : MODIFICATION-->
              <tbody>
              <tr :key="item.name" v-for="item in items">
                <!--COM--><td><v-btn v-if="item.commentaire" icon color="primary" @click.stop="$set(dialogNote, item.num, true), fetchComment(item.commentaire)"><v-icon medium color="red">mdi-comment-text-outline</v-icon></v-btn><v-btn v-if="!item.commentaire" icon color="grey" @click.stop="$set(dialogNote, item.num, true), fetchComment(item.commentaire)"><v-icon medium>mdi-comment-text-outline</v-icon></v-btn><v-dialog v-model="dialogNote[item.num]" scrollable max-width="500" :key="item.num"><v-card><v-card-title><span>Note de la demande {{ item.num }}</span></v-card-title><v-card-text style="padding-top: 10px; margin-bottom: -25px;"><v-textarea v-model="commentaireMaj" outlined label="Commentaire"></v-textarea></v-card-text><v-card-actions><v-spacer></v-spacer><v-btn color="primary" @click.stop="$set(dialogNote, item.num, false); saveComment(item.num, commentaireMaj)">Enregistrer</v-btn></v-card-actions></v-card></v-dialog></td>
                <!--DEM--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.num }}</td>
                <td v-if="!item.isClickable">{{ item.num }}</td>
                <!--MAJ--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.dateModification }}</td>
                <td v-if="!item.isClickable">{{ item.dateModification }}</td>
                <!--ILN--><td v-if="item.isClickable && user.role === 'ADMIN'" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.iln }}</td>
                <td v-if="!item.isClickable && user.role === 'ADMIN'">{{ item.iln }}</td>
                <!--RCR--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.rcr }}</td>
                <td v-if="!item.isClickable">{{ item.rcr }}</td>
                <!--ZON--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.zoneSousZone }}</td>
                <td v-if="!item.isClickable">{{ item.zoneSousZone }}</td>
                <!--TRT--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.typeExemp }}</td>
                <td v-if="!item.isClickable">{{ item.typeExemp }}</td>
                <!--STA--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable"><v-chip :color="getColor(item.statut)" dark>{{ item.statut }}</v-chip><div v-if="item.codeStatut === 6">{{ item.percentOfProgression + ' %' }}</div></td>
                <td v-if="!item.isClickable"><v-chip :color="getColor(item.statut)" dark>{{ item.statut }}</v-chip><div v-if="item.codeStatut === 6">{{ item.percentOfProgression + ' %' }}</div></td>
                <!--TL1--><td>
                <v-menu bottom left v-if="item.codeStatut >= 2"><template v-slot:activator="{ on }"><v-btn aria-label="Télécharger les fichiers" class="cloudButton" color="info" small v-on="on" title="Télécharger"><v-icon>cloud_download</v-icon></v-btn></template>
                  <!-- FICHIERS MODIF -->
                  <v-list v-if="item.codeStatut >= 3 && modif === 'MODIF'">
                    <v-list-item @click="downloadFile(item.num, 'ppn')"><v-list-item-title>Télécharger le fichier initial des PPN</v-list-item-title></v-list-item>
                    <v-list-item @click="downloadFile(item.num, 'epn')"><v-list-item-title>Télécharger le fichier de correspondance PPN/EPN</v-list-item-title></v-list-item>
                    <v-list-item @click="downloadFile(item.num, 'enrichi')" v-if="item.codeStatut >= 4"><v-list-item-title>Télécharger le fichier enrichi</v-list-item-title></v-list-item>
                    <v-list-item @click="downloadFile(item.num, 'resultat')" v-if="item.codeStatut >= 7 && item.codeStatut !== 8"><v-list-item-title>Télécharger le fichier résultat</v-list-item-title></v-list-item>
                  </v-list>
                </v-menu>
                <span v-if="item.codeStatut == 1">
                  <v-btn aria-label="Téléchargement impossible" class="cloudButton" color="info" disabled small><v-icon>cloud_download</v-icon></v-btn>
                </span>
              </td>
                <!--AR2--><td class="text-center" v-if="!archive">
                <span v-if="(item.codeStatut < 5 && user.iln === item.iln) || (item.codeStatut < 5 && user.iln === '1')">
                  <v-btn @click="current = item.num; popupDelete = true;" aria-label="Supprimer" icon title="Supprimer"><v-icon>delete</v-icon></v-btn>
                </span>
                <span v-else-if="item.codeStatut == 7 && user.iln == item.iln">
                  <v-btn @click="current = item.num; popupArchive = true;" aria-label="Archiver" icon title="Archiver"><v-icon>archive</v-icon></v-btn>
                </span>
              </td>
              </tr>
              </tbody>
            </template>
          </v-data-table>
          <!--Ligne d'entête du tableau de RECOUVREMENT-->
          <v-data-table :custom-sort="customSort" :sort-by.sync="sortBy" :sort-desc.sync="descending" v-if="modif === 'RECOUV'" :headers="headers" :items="computedItems('guess')" :items-per-page="10" class="elevation-1" item-key="num" loading-text="chargement.." no-data-text="Aucune demande trouvée" no-results-text="Aucun resultat trouvé" :headers-length="3" :footer-props="{showFirstLastPage: true, itemsPerPageOptions:[10,25,-1], itemsPerPageAllText:'Toutes', itemsPerPageText:'Lignes par page'}">
            <!--Tableau de RECOUVREMENT-->
            <template v-slot:body="{ items }">
              <!--Ligne avec les champs de recherche : RECOUVREMENT-->
              <thead>
              <tr>
                <!--COM--><th></th>
                <!--DEM--><th><v-text-field append-icon="search" aria-label="Recherche par numéro" clear-icon='clear' clearable hide-details single-line v-model="searchNum" v-on:keyup="computedItems('num')"></v-text-field></th>
                <!--CRE--><th><v-text-field clearable class="item-calendar-searchfield-item" append-icon="search" persistent-hint v-model="searchDateCreation" v-on:keyup="computedItems('dateCreation')"></v-text-field></th>
                <!--MAJ--><th><v-text-field clearable class="item-calendar-searchfield-item" append-icon="search" persistent-hint v-model="searchDateModification" v-on:keyup="computedItems('dateModification')"></v-text-field></th>
                <!--ILN--><th v-if="user.role === 'ADMIN'"><v-text-field class="appropriateFontSize" append-icon="search" aria-label="Recherche par ILN" clear-icon='clear' clearable hide-details single-line v-model="searchILN" v-on:keyup="computedItems('iln')"></v-text-field></th>
                <!--RCR--><th><v-text-field class="appropriateFontSize" append-icon="search" aria-label="Recherche par RCR"  clear-icon='clear' clearable hide-details single-line v-model="searchRCR" v-on:keyup="computedItems('rcr')"></v-text-field></th>
                <!--IND--><th><v-text-field class="appropriateFontSize" append-icon="search" aria-label="Recherche par Index"  clear-icon='clear' clearable hide-details single-line v-model="searchIndexRecherche" v-on:keyup="computedItems('indexRecherche')"></v-text-field></th>
                <!--STA--><th v-if="!archive"><v-select :items="listStatut" @change="computedItems('statut')" aria-label="Recherche par statut" clear-icon='clear' clearable no-data-text="Aucun statut trouvé." v-model="searchStatut"></v-select></th>
                <!--TL1--><th></th>
                <!--AR2--><th></th>
              </tr>
              </thead>
              <!--Lignes de données : RECOUVREMENT-->
              <tbody>
              <tr :key="item.name" v-for="item in items">
                <!--COM--><td><v-btn v-if="item.commentaire" icon color="primary" @click.stop="$set(dialogNote, item.num, true), fetchComment(item.commentaire)"><v-icon medium color="red">mdi-comment-text-outline</v-icon></v-btn><v-btn v-if="!item.commentaire" icon color="grey" @click.stop="$set(dialogNote, item.num, true), fetchComment(item.commentaire)"><v-icon medium>mdi-comment-text-outline</v-icon></v-btn><v-dialog v-model="dialogNote[item.num]" scrollable max-width="500" :key="item.num"><v-card><v-card-title><span>Note de la demande {{ item.num }}</span></v-card-title><v-card-text style="padding-top: 10px; margin-bottom: -25px;"><v-textarea v-model="commentaireMaj" outlined label="Commentaire"></v-textarea></v-card-text><v-card-actions><v-spacer></v-spacer><v-btn color="primary" @click.stop="$set(dialogNote, item.num, false); saveComment(item.num, commentaireMaj)">Enregistrer</v-btn></v-card-actions></v-card></v-dialog></td>
                <!--DEM--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.num }}</td>
                <td v-if="!item.isClickable">{{ item.num }}</td>
                <!--CRE--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.dateCreation }}</td>
                <td v-if="!item.isClickable">{{ item.dateCreation }}</td>
                <!--MAJ--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.dateModification }}</td>
                <td v-if="!item.isClickable">{{ item.dateModification }}</td>
                <!--ILN--><td v-if="item.isClickable && user.role === 'ADMIN'" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.iln }}</td>
                <td v-if="!item.isClickable && user.role === 'ADMIN'">{{ item.iln }}</td>
                <!--RCR--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.rcr }}</td>
                <td v-if="!item.isClickable">{{ item.rcr }}</td>
                <!--IND--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable">{{ item.indexRecherche }}</td>
                <td v-if="!item.isClickable">{{ item.indexRecherche }}</td>
                <!--STA--><td v-if="item.isClickable" @click="clickRow(item.num, item.codeStatut)" class="clickable"><v-chip :color="getColor(item.statut)" dark>{{ item.statut }}</v-chip><div v-if="item.codeStatut === 6">{{ item.percentOfProgression + ' %' }}</div></td>
                <td v-if="!item.isClickable">
                  <v-chip :color="getColor(item.statut)" dark>{{ item.statut }}</v-chip>
                  <div v-if="item.codeStatut === 6">{{ item.percentOfProgression + ' %' }}</div>
                  <div style="float: right; margin-left: -2em; margin-top: 0.25em" v-if="item.codeStatut === 5 && item.indexRecherche === 'Date;Auteur;Titre'">
                    <v-tooltip bottom dark>
                      <template v-slot:activator="{ on }">
                        <v-icon color="orange"  dark v-on="on">info</v-icon>
                      </template>
                      <span>Les requêtes date;auteur;titre sont traitées entre 20h et 8h. (J+1)</span>
                    </v-tooltip>
                  </div>
                </td>
                <!--TL1--><td>
                <v-menu bottom left v-if="item.codeStatut >= 2"><template v-slot:activator="{ on }"><v-btn aria-label="Télécharger les fichiers" class="cloudButton" color="info" small v-on="on" title="Télécharger"><v-icon>cloud_download</v-icon></v-btn></template>
                  <!-- FICHIERS RECOUV -->
                  <v-list v-if="item.codeStatut >= 3 && modif === 'RECOUV'">
                    <v-list-item @click="downloadFile(item.num, 'initRecouv')"><v-list-item-title>Télécharger le fichier déposé</v-list-item-title></v-list-item>
                    <v-list-item @click="downloadFile(item.num, 'resultatRecouv')" v-if="item.codeStatut >= 7 && item.codeStatut !== 8"><v-list-item-title>Télécharger le fichier résultat</v-list-item-title></v-list-item>
                  </v-list>
                </v-menu>
                <span v-if="item.codeStatut === 1">
                  <v-btn aria-label="Téléchargement impossible" class="cloudButton" color="info" disabled small><v-icon>cloud_download</v-icon></v-btn>
                </span>
              </td>
                <!--AR2--><td class="text-center" v-if="!archive">
                <span v-if="(item.codeStatut < 5 && user.iln === item.iln) || (item.codeStatut < 5 && user.iln === '1')">
                  <v-btn @click="current = item.num; popupDelete = true;" aria-label="Supprimer" icon title="Supprimer"><v-icon>delete</v-icon></v-btn>
                </span>
                <span v-else-if="item.codeStatut === 7 && user.iln === item.iln">
                  <v-btn @click="current = item.num; popupArchive = true;" aria-label="Archiver" icon title="Archiver"><v-icon>archive</v-icon></v-btn>
                </span>
              </td>
                <!--Zone de commentaire associée à un item-->
              </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <!--Zone des fenêtres de dialogue pour télécharger les fichiers-->
      <v-dialog v-model="popupDownloadFile" width="500">
        <v-card>
          <v-card-title class="headline" primary-title>Téléchargement du fichier</v-card-title>
          <v-card-text>
            <div v-if="!fileReady">Votre fichier est en cours de téléchargement, veuillez patienter.
              <v-progress-linear :indeterminate="true"></v-progress-linear>
            </div>
            <div v-if="fileReady">
              <v-col class="text-center align justify fill-height"><v-btn :download="blobName" :href="fileLink" color="secondary" large outlined ref="fileLinkBtn">Télécharger le fichier<v-icon dark right>cloud_download</v-icon></v-btn></v-col>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="popupDownloadFile = false" aria-label="Fermer" text>Fermer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-if="!archive" v-model="popupDelete" width="500">
        <v-card>
          <v-card-title class="headline" primary-title>Suppression</v-card-title>
          <v-card-text>
            Êtes-vous certain de vouloir supprimer définitivement cette demande ?
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="popupDelete = false" aria-label="Annuler" text>Annuler</v-btn>
            <v-btn :disabled="deleteLoading" :loading="deleteLoading" @click="deleteDemWithPreservation"  aria-label="Confirmer" text>Confirmer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-if="!archive" v-model="popupArchive" width="500">
        <v-card>
          <v-card-title class="headline" primary-title>Archiver</v-card-title>
          <v-card-text>
            Êtes-vous certain de vouloir archiver cette demande ?
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="popupArchive = false" aria-label="Annuler" color="primary" text>Annuler</v-btn>
            <v-btn :disabled="deleteLoading" :loading="deleteLoading" @click="archiveDem" aria-label="Confirmer" color="primary" text>Confirmer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<script setup>
</script>