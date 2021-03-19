##Note en cas de probleme l'ors du premier pull du projet

Sur une nouvelle machine, en cas de probleme au premier pull du projet,
taper la commande suivante en terminal
```
npm i @vue/cli-plugin-babel
```

Pour reinstaller le plugin cli-plugin-babel

# item-client

**I**nterface de **T**raitement des **E**xemplaires en **M**asse dans le Sudoc (partie client).

- URL de production : https://item.sudoc.fr
- Documentation utilisateur : http://documentation.abes.fr/aideitem/index.html

Cette application est constituée uniquement de HTML, CSS et JS. Elle est construite avec le [framework VueJS](https://vuejs.org/).
Elle ne peut fonctionner sans la partie serveur dont le rôle est de mettre à disposition l'API (web service) d'Item.

A noter que la partie serveur n'est pas encore en opensource mais l'API d'Item étant en production sur les serveur de l'Abes ici https://item.sudoc.fr/,
il est alors potentiellement possible de développer des adaptations de l'interface sans avoir besoin sur sa machine locale de la partie serveur.  

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

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
