export default {
  erreur500: 'Le service est indisponible. Veuillez réessayer ultérieurement. Si le problème persiste, merci de contacter l\'assistance.',
  erreurUpload: 'Une erreur est survenue lors de l\'envoi du fichier.',
  erreurDownload: 'Une erreur est survenue lors de la récupération du fichier.',
  erreurRCR: 'Il est impossible d\'afficher la liste des RCR.',
  erreurListeTraitements: 'Impossible de récupérer la liste des traitements.',
  erreurTypeExemp: 'Le tri par type d’exemplarisation est impossible.',
  erreurListeExemp: 'Il est Impossible de récupérer la liste des exemplarisations.',
  erreurDemande: 'Impossible mettre à jour la demande.',

  headersArchiveAdminModif: [
    { text: '', value: 'expand', width: '5%' },
    {
      text: 'Demande', align: 'center', value: 'num', width: '11%',
    },
    {
      text: 'Mise à jour', align: 'center', value: 'dateModification', width: '15%',
    },
    {
      text: 'ILN', align: 'center', value: 'iln', width: '10%',
    },
    {
      text: 'RCR', align: 'center', value: 'rcr', width: '10%',
    },
    {
      text: 'Zones et sous-zones', align: 'center', value: 'zoneSousZone', width: '10%',
    },
    {
      text: 'Traitement', align: 'center', value: 'traitement', width: '20%',
    },
    {
      text: 'Statut', align: 'center', value: 'codeStatut', width: '7%',
    },
    {
      text: 'Téléchargement', align: 'center', value: '', width: '12%',
    },
  ],
  headersArchiveModif: [
    { text: '', value: 'expand', width: '5%' },
    {
      text: 'Demande', align: 'center', value: 'num', width: '15%',
    },
    {
      text: 'Mise à jour', align: 'center', value: 'dateModification', width: '15%',
    },
    {
      text: 'RCR', align: 'center', value: 'rcr', width: '15%',
    },
    {
      text: 'Zones et sous-zones', align: 'center', value: 'zoneSousZone', width: '11%',
    },
    {
      text: 'Traitement', align: 'center', value: 'traitement', width: '20%',
    },
    {
      text: 'Statut', align: 'center', value: 'codeStatut', width: '7%',
    },
    {
      text: 'Téléchargement', align: 'center', value: '', width: '12%',
    },
  ],
  headerModifAdmin: [
    { text: '', value: 'expand', width: '5%' },
    {
      text: 'Demande', align: 'center', value: 'num', width: '7%',
    },
    {
      text: 'Mise à jour', align: 'center', value: 'dateModification', width: '10%',
    },
    {
      text: 'ILN', align: 'center', value: 'iln', width: '10%',
    },
    {
      text: 'RCR', align: 'center', value: 'rcr', width: '10%',
    },
    {
      text: 'Zones et sous-zones', align: 'center', value: 'zoneSousZone', width: '15%',
    },
    {
      text: 'Traitement', align: 'center', value: 'traitement', width: '15%',
    },
    {
      text: 'Statut', align: 'center', value: 'statut', width: '10%',
    },
    {
      text: 'Téléchargement', align: 'center', value: 'codeStatut', width: '10%',
    },
    {
      text: 'Action', align: 'center', value: 'delete', width: '9%',
    },
  ],
  headerModif: [
    { text: '', value: 'expand', width: '5%' },
    {
      text: 'Demande', align: 'center', value: 'num', width: '7%',
    },
    {
      text: 'Mise à jour', align: 'center', value: 'dateModification', width: '15%',
    },
    {
      text: 'RCR', align: 'center', value: 'rcr', width: '5%',
    },
    {
      text: 'Zones et sous-zones', align: 'center', value: 'zoneSousZone', width: '15%',
    },
    {
      text: 'Traitement', align: 'center', value: 'traitement', width: '25%',
    },
    {
      text: 'Statut', align: 'center', value: 'statut', width: '10%',
    },
    {
      text: 'Téléchargement', align: 'center', value: 'codeStatut', width: '10%',
    },
    {
      text: 'Action', align: 'center', value: 'delete', width: '6%',
    },
  ],
  headerExempAdmin: [
    { text: '', value: 'expand', width: '5%' },
    {
      text: 'Demande', align: 'center', value: 'num', width: '8%',
    },
    {
      text: 'Création', align: 'center', value: 'dateCreation', width: '10%',
    },
    {
      text: 'Mise à jour', align: 'center', value: 'dateModification', width: '10%',
    },
    {
      text: 'ILN', align: 'center', value: 'iln', width: '7%',
    },
    {
      text: 'RCR', align: 'center', value: 'rcr', width: '8%',
    },
    {
      text: 'Type', align: 'center', value: 'typeExemp', width: '15%',
    },
    {
      text: 'Index', align: 'center', value: 'indexRecherche', width: '7%',
    },
    {
      text: 'Statut', align: 'center', value: 'statut', width: '14%',
    },
    {
      text: 'Téléchargement', align: 'center', value: 'codeStatut', width: '10%',
    },
    {
      text: 'Action', align: 'center', value: 'delete', width: '6%',
    },
  ],
  headerExemp: [
    { text: '', value: 'expand', width: '5%' },
    {
      text: 'Demande', align: 'center', value: 'num', width: '6%',
    },
    {
      text: 'Création', align: 'center', value: 'dateCreation', width: '10%',
    },
    {
      text: 'Mise à jour', align: 'center', value: 'dateModification', width: '10%',
    },
    {
      text: 'RCR', align: 'center', value: 'rcr', width: '10%',
    },
    {
      text: 'Type', align: 'center', value: 'typeExemp', width: '15%',
    },
    {
      text: 'Index', align: 'center', value: 'indexRecherche', width: '10%',
    },
    {
      text: 'Statut', align: 'center', value: 'statut', width: '10%',
    },
    {
      text: 'Téléchargement', align: 'center', value: 'codeStatut', width: '10%',
    },
    {
      text: 'Action', align: 'center', value: 'delete', width: '5%',
    },
  ],
  headerExempArchiveAdmin: [
    { text: '', value: 'expand', width: '5%' },
    {
      text: 'Demande', align: 'center', value: 'num', width: '10%',
    },
    {
      text: 'Création', align: 'center', value: 'dateCreation', width: '12%',
    },
    {
      text: 'Mise à jour', align: 'center', value: 'dateModification', width: '12%',
    },
    {
      text: 'ILN', align: 'center', value: 'iln', width: '8%',
    },
    {
      text: 'RCR', align: 'center', value: 'rcr', width: '10%',
    },
    {
      text: 'Type', align: 'center', value: 'typeExemp', width: '15%',
    },
    {
      text: 'Index', align: 'center', value: 'indexRecherche', width: '10%',
    },
    {
      text: 'Téléchargement', align: 'center', value: 'codeStatut', width: '10%',
    },
    {
      text: 'Action', align: 'center', value: 'delete', width: '18%',
    },
  ],
  headerExempArchive: [
    { text: '', value: 'expand', width: '5%' },
    {
      text: 'Demande', align: 'center', value: 'num', width: '15%',
    },
    {
      text: 'Création', align: 'center', value: 'dateCreation', width: '15%',
    },
    {
      text: 'Mise à jour', align: 'center', value: 'dateModification', width: '15%',
    },
    {
      text: 'RCR', align: 'center', value: 'rcr', width: '10%',
    },
    {
      text: 'Type', align: 'center', value: 'typeExemp', width: '15%',
    },
    {
      text: 'Index', align: 'center', value: 'indexRecherche', width: '15%',
    },
    {
      text: 'Téléchargement', align: 'center', value: 'codeStatut', width: '10%',
    },
  ],
  headerRecouvAdmin: [
    { text: '', value: 'expand', width: '5%' },
    {
      text: 'Demande', align: 'center', value: 'num', width: '10%',
    },
    {
      text: 'Création', align: 'center', value: 'dateCreation', width: '10%',
    },
    {
      text: 'Mise à jour', align: 'center', value: 'dateModification', width: '10%',
    },
    {
      text: 'ILN', align: 'center', value: 'iln', width: '7%',
    },
    {
      text: 'RCR', align: 'center', value: 'rcr', width: '8%',
    },
    {
      text: 'Index', align: 'center', value: 'indexRecherche', width: '10%',
    },
    {
      text: 'Statut', align: 'center', value: 'statut', width: '15%',
    },
    {
      text: 'Téléchargement', align: 'center', value: 'codeStatut', width: '8%',
    },
    {
      text: 'Action', align: 'center', value: 'delete', width: '7%',
    },
  ],
  headerRecouv: [
    { text: '', value: 'expand', width: '5%' },
    {
      text: 'Demande', align: 'center', value: 'num', width: '10%',
    },
    {
      text: 'Création', align: 'center', value: 'dateCreation', width: '10%',
    },
    {
      text: 'Mise à jour', align: 'center', value: 'dateModification', width: '10%',
    },
    {
      text: 'RCR', align: 'center', value: 'rcr', width: '10%',
    },
    {
      text: 'Index', align: 'center', value: 'indexRecherche', width: '10%',
    },
    {
      text: 'Statut', align: 'center', value: 'statut', width: '15%',
    },
    {
      text: 'Téléchargement', align: 'center', value: 'codeStatut', width: '8%',
    },
    {
      text: 'Action', align: 'center', value: 'delete', width: '7%',
    },
  ],
  headerRecouvArchiveAdmin: [
    { text: '', value: 'expand', width: '5%' },
    {
      text: 'Demande', align: 'center', value: 'num', width: '10%',
    },
    {
      text: 'Création', align: 'center', value: 'dateCreation', width: '15%',
    },
    {
      text: 'Mise à jour', align: 'center', value: 'dateModification', width: '15%',
    },
    {
      text: 'ILN', align: 'center', value: 'iln', width: '10%',
    },
    {
      text: 'RCR', align: 'center', value: 'rcr', width: '10%',
    },
    {
      text: 'Index', align: 'center', value: 'indexRecherche', width: '10%',
    },
    {
      text: 'Statut', align: 'center', value: 'codeStatut', width: '10%',
    },
    {
      text: 'Téléchargement', align: 'center', value: 'codeStatut', width: '10%',
    },
  ],
  headerRecouvArchive: [
    { text: '', value: 'expand', width: '5%' },
    {
      text: 'Demande', align: 'center', value: 'num', width: '15%',
    },
    {
      text: 'Création', align: 'center', value: 'dateCreation', width: '15%',
    },
    {
      text: 'Mise à jour', align: 'center', value: 'dateModification', width: '15%',
    },
    {
      text: 'RCR', align: 'center', value: 'rcr', width: '10%',
    },
    {
      text: 'Index', align: 'center', value: 'indexRecherche', width: '15%',
    },
    {
      text: 'Statut', align: 'center', value: 'codeStatut', width: '10%',
    },
    {
      text: 'Téléchargement', align: 'center', value: 'codeStatut', width: '10%',
    },
  ],
};
