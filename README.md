# item-client

[![build-test-pubtodockerhub](https://github.com/abes-esr/item-client/actions/workflows/build-test-pubtodockerhub.yml/badge.svg)](https://github.com/abes-esr/item-client/actions/workflows/build-test-pubtodockerhub.yml) [![Docker Pulls](https://img.shields.io/docker/pulls/abesesr/item.svg)](https://hub.docker.com/r/abesesr/item/)

**I**nterface de **T**raitement des **E**xemplaires en **M**asse dans le Sudoc (partie client).

- URL de production : https://item.sudoc.fr
- Documentation utilisateur : http://documentation.abes.fr/aideitem/index.html

Ce dépôt héberge le code source de l'interface utilisateur de item (développée en VueJS).  
Cette interface utilisateur fonctionne avec son API développée en Java : https://github.com/abes-esr/item-api/  
Et l'application item complète peut être déployée via Docker à l'aide de ce dépôt : https://github.com/abes-esr/item-docker/

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
### Compiles for dev
```
npm run build-dev
```

### Compiles for test
```
npm run build-test
```
### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

## Note en cas de probleme l'ors du premier pull du projet

Sur une nouvelle machine, en cas de probleme au premier pull du projet,
taper la commande suivante en terminal
```
npm i @vue/cli-plugin-babel
```

Pour reinstaller le plugin cli-plugin-babel

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Versions des dépendances de référence (pour problèmes de compatibilité)

- "dependencies"
- "vue": "2.7.10",
- "vue-router": "3.6.5",
- "vuetify": "2.6.14"
- "sass-loader": "10.4.1",
----
- "devDependencies"
- "sass": "~1.32.6",
----
- "resolutions"
- "@nuxtjs/vuetify/**/sass": "1.32.12"
