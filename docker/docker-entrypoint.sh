#!/bin/bash

# Paramètres par défaut du conteneur
export ITEM_FRONT_API_BASEURL=${ITEM_FRONT_API_BASEURL:='http://localhost:8081/'}
export ITEM_FRONT_IDREF_API_URL=${ITEM_FRONT_IDREF_API_URL:='http://localhost:8081/'}
export ITEM_FRONT_MAINTENANCE=${ITEM_FRONT_MAINTENANCE:='0'}


# Remplace les placeholders dans le code généré en prod
# ITEM_PLACEHOLDER_VUE_APP_ROOT_API
# On va remplacer les placeholders depuis les JS originales
echo "-> Remplacement des placeholders venant du .env de vuejs dans la destination /usr/share/nginx/html/"
echo "-> ITEM_FRONT_API_BASEURL=${ITEM_FRONT_API_BASEURL}"
echo "-> ITEM_PLACEHOLDER_VITE_IDREF_API_URL=${ITEM_FRONT_IDREF_API_URL}"
echo "-> ITEM_PLACEHOLDER_VITE_MAINTENANCE=${ITEM_FRONT_MAINTENANCE}"
rm -rf /usr/share/nginx/html/
cp -rf /usr/share/nginx/html.orig/ /usr/share/nginx/html/
sed -i \
  "s#ITEM_PLACEHOLDER_VITE_API_URL#${ITEM_FRONT_API_BASEURL}#g" \
  /usr/share/nginx/html/assets/*
sed -i \
  "s#ITEM_PLACEHOLDER_VITE_IDREF_API_URL#${ITEM_FRONT_IDREF_API_URL}#g" \
  /usr/share/nginx/html/assets/*
sed -i \
  "s#ITEM_PLACEHOLDER_VITE_MAINTENANCE#${ITEM_FRONT_MAINTENANCE}#g" \
  /usr/share/nginx/html/assets/*

# execute nginx (cf CMD dans Dockerfile)
exec "$@"
