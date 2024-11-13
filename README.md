# item-client

[![build-test-pubtodockerhub](https://github.com/abes-esr/item-client/actions/workflows/build-test-pubtodockerhub.yml/badge.svg)](https://github.com/abes-esr/item-client/actions/workflows/build-test-pubtodockerhub.yml) [![Docker Pulls](https://img.shields.io/docker/pulls/abesesr/item.svg)](https://hub.docker.com/r/abesesr/item/)

**I**nterface de **T**raitement des **E**xemplaires en **M**asse dans le Sudoc (partie client).

- URL de production : https://item.sudoc.fr
- Documentation utilisateur : http://documentation.abes.fr/aideitem/index.html

Ce dépôt héberge le code source de l'interface utilisateur de Item (développée en VueJS) codée en VueJs 3. 
Cette interface utilisateur fonctionne en lien avec son API développée en Java : https://github.com/abes-esr/item-api/  
L'application Item complète peut être déployée via Docker à l'aide de ce dépôt : https://github.com/abes-esr/item-docker/ . 
Les principaux plugins installés dans ce projet sont : Vite, Pinia, Vue-router, Vuetify et Axios.

Item nécessite de se logger. Vous devrez donc disposer d'un droit d'accès à l'application pour pouvoir l'utiliser.

## Usage

Item permet de :
* Calculer ses taux de recouvrement
* Gérer ses taux de recouvrement
* Créer des exemplaires
* Gérer ses créations d'exemplaires
* Modifier des exemplaires
* Gérer ses modifications d'exemplaires
* Supprimer des exemplaires
* Gérer ses suppressions d'exemplaires

Chacune de ces demandes sera envoyée à item-back qui effectuera les traitements demandés.

Des emails récapitulatifs seront envoyés durant les traitements afin d'informer sur l'état de leur réalisation. Un email valide est donc nécessaire.


## Project setup
```
npm install
```
Une fois installée, il faut dupliquer le ``.env-dist`` puis renommer le duplicata en ``.env``. Completer ensuite les variables d'environnement dans le ``.env``.

### Compiles and hot-reloads for development
```
npm run dev
```
Une fois cette commande lancée, l'url de l'application sera affichée (dans le terminal ou dans les logs, selon l'environnement de déploiement).

### Compiles for build
```
npm run build
```

### Compiles for preview
```
npm run preview
```

### Compiles for prettier
```
npm run prettier
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
