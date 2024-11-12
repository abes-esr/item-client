# item-client

[![build-test-pubtodockerhub](https://github.com/abes-esr/item-client/actions/workflows/build-test-pubtodockerhub.yml/badge.svg)](https://github.com/abes-esr/item-client/actions/workflows/build-test-pubtodockerhub.yml) [![Docker Pulls](https://img.shields.io/docker/pulls/abesesr/item.svg)](https://hub.docker.com/r/abesesr/item/)

**I**nterface de **T**raitement des **E**xemplaires en **M**asse dans le Sudoc (partie client).

- URL de production : https://item.sudoc.fr
- Documentation utilisateur : http://documentation.abes.fr/aideitem/index.html

Ce dépôt héberge le code source de l'interface utilisateur de item (développée en VueJS). 
Cette interface utilisateur fonctionne avec son API développée en Java : https://github.com/abes-esr/item-api/  
Et l'application item complète peut être déployée via Docker à l'aide de ce dépôt : https://github.com/abes-esr/item-docker/
Les principaux plugins sont VueJs 3, Vite, Pinia, Vue-router, Vuetify et Axios.

## Project setup
```
npm install
```
une fois installer, il faut copier le ``.env-dist`` pour avoir un ``.env`` et completer les variables d'environement, tel que l'url du back.

### Compiles and hot-reloads for development
```
npm run dev
```
l'url est précisé dans le resultat de la ligne de commande si dessus.
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
