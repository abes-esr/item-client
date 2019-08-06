<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-card>
          <v-card-title primary-title>
            <div>
              <h1 class="display-3">Données personnelles</h1>
            </div>
          </v-card-title>
          <v-card-text>
            <p>
              L'ABES s'engage à ce que la collecte et le traitement de vos données soient conformes au Règlement Général européen sur la Protection des Données (RGPD).
            </p>
            <h2 class="display-1">1. Gestion des données personnelles</h2>
            <p>Aucune information personnelle n’est collectée à votre insu.</p>
            <h2 class="display-1">2. A propos des cookies</h2>
            <p>Nous utilisons différents cookies sur le site pour améliorer l’interactivité du site et nos services.</p>
            <h3 class="headline">A. Qu'est-ce qu'un "cookie" ?</h3>
            <p>
              Un "cookie" est un fichier de taille limitée, généralement constitué
              de lettres et de chiffres, envoyé par le serveur internet au fichier
              cookie de votre navigateur.
            </p>
            <p>
              <a
                href="https://www.cnil.fr/node/337"
              >En savoir plus sur les cookies, leur fonctionnement et les moyens de s’y opposer</a>.
            </p>
            <h3 class="headline">B. Types de cookies déposés sur ce site :</h3>
            <h4 class="title">1) Cookies internes nécessaires au fonctionnement du site</h4>
            <p>
              Ces cookies permettent au site de fonctionner de manière optimale.
              Vous pouvez vous y opposer et les supprimer en utilisant les paramètres
              de votre navigateur, cependant votre expérience utilisateur risque
              d’être dégradée.
            </p>
            <table border="1">
              <thead>
                <tr>
                  <th>Nom du cookie</th>
                  <th>Finalité</th>
                  <th>Durée de conservation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>cookie-banner-accept</td>
                  <td>Acceptation de l’utilisation de cookies</td>
                  <td>13 mois</td>
                </tr>
              </tbody>
            </table>
            <br />
            <p>
              Nous collectons également votre adresse IP, anonymisée, afin de
              déterminer la ville depuis laquelle vous vous connectez. L'application
              Ce site ne peut donc en aucun cas remonter par ce biais à une personne physique.
            </p>
            <p>
              Les données personnelles recueillies (identifiant du cookie) sont
              conservées par l'ABES pour une durée de 13 mois. Elles ne sont ni cédées
              à des tiers, ni utilisées à d'autres fins.
            </p>
            <p>Vous pouvez choisir de refuser les cookies et l’analyse statistique de vos données de navigation.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  h2 {
    margin-bottom: 20px;
  }
  .title,
  .headline {
    margin-bottom: 10px;
  }
</style>
