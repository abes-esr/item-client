# item-client

Le langage utilisé est JavaScript, avec le framework VueJs 3.

Ce dépôt héberge le code source de l'interface utilisateur de Item (développée en VueJS) codée en VueJs 3.
Cette interface utilisateur fonctionne en lien avec son API développée en Java : https://github.com/abes-esr/item-api/  
L'application Item complète peut être déployée via Docker à l'aide de ce
dépôt : https://github.com/abes-esr/item-docker/ .
Les principaux plugins installés dans ce projet sont : Vite, Pinia, Vue-router, Vuetify et Axios.

## Installation du projet et démarrage

### Installation du projet

```
npm install
```

Une fois installé, il faut dupliquer le ``.env-dist`` puis renommer le duplicata en ``.env``. Completer ensuite les
variables d'environnement dans le ``.env``.

### Compilation et rechargement à chaud pour le développement

```
npm run dev
```

Une fois cette commande lancée, l'url de l'application sera affichée (dans le terminal ou dans les logs, selon
l'environnement de déploiement).

### Compilation complète

```
npm run build
```

### Compilation pour prévisualisation

```
npm run preview
```

### Compilation "prettier"

```
npm run prettier
```

### Configurations personnalisées

See [Configuration Reference](https://cli.vuejs.org/config/).

## Maintenance

Pour passer l'application en mode maintenance il suffit de passer la variable d'environement `VITE_MAINTENANCE` à
`1`.  
Sinon pour passer en mode maintenance sur les serveurs, il suffit de passer la variable `ITEM_FRONT_MAINTENANCE` à `1`
du projet [Item-docker](https://github.com/abes-esr/item-docker).
