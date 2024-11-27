# item-client

Vous êtes sur le README usager. Si vous souhaitez accéder au README développement, veuillez suivre ce lien : [README-developpement](README-developpement.md)

[![build-test-pubtodockerhub](https://github.com/abes-esr/item-client/actions/workflows/build-test-pubtodockerhub.yml/badge.svg)](https://github.com/abes-esr/item-client/actions/workflows/build-test-pubtodockerhub.yml) [![Docker Pulls](https://img.shields.io/docker/pulls/abesesr/item.svg)](https://hub.docker.com/r/abesesr/item/)

**I**nterface de **T**raitement des **E**xemplaires en **M**asse dans le Sudoc (partie client).

- URL de production : https://item.sudoc.fr
- Documentation utilisateur : http://documentation.abes.fr/aideitem/index.html

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
