<template>
  <v-container fluid>
    <v-layout justify-center align-center>
      <v-flex text-xs-center>
        <v-card id="demInfos">
          <h3 style="padding-top: 15px; padding-left: 15px;" class="headline">Ma demande</h3>
          <v-container grid-list-md>
            <v-layout row wrap>
              <v-flex xs3>
                <div style="padding: 15px;">
                  <span style="color: grey;">Numéro de Demande</span>
                  <br />
                  <span>65646</span>
                </div>
              </v-flex>
              <v-flex xs3>
                <div style="padding: 15px;">
                  <span style="color: grey;">Date de création</span>
                  <br />
                  <span>2018-11-13</span>
                </div>
              </v-flex>
              <v-flex xs3>
                <div style="padding: 15px;">
                  <span style="color: grey;">RCR</span>
                  <br />
                  <span>110695101 - CARCASSONNE-C.Nat.Et.Cathares</span>
                </div>
              </v-flex>
              <v-flex xs3>
                <div style="padding: 15px;">
                  <span style="color: grey;">Traitement</span>
                  <br />
                  <span>Supprimer une zone</span>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
        <v-card>
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <v-flex xs5>
                <v-layout fill-height>
                  <v-card class="elevation-8">
                    <v-container fill-height fluid pa-2>
                      <v-layout fill-height>
                        <v-flex xs12 align-end flexbox>
                          <span class="headline --text">Avant</span>
                          <div>
                            <pre>
930 ##$b341720001$jg##$b341720001$jg##$b341720001$jg##$b341720001$jg##$b341720001$jg##$b341720001$jg##$b341720001$jg##$b341720001$jg##$b341720001$jg##$b341720001$jg##$b341720001$jg##$b341720001$jg##$b341720001$jg##$b341720001$jg##$b341720001$jg
A97 25-04-18 11:50:11.000
A98 341720001:25-04-18
A99 591185806

930 ##$b341720001$jg
A97 25-04-18 11:50:22.000
A98 341720001:25-04-18
A99 591185814

930 ##$b341720001$jg
A97 25-04-18 14:23:12.000
A98 341720001:25-04-18
A99 591185822

930 ##$b341720001$jg
A97 12-09-18 16:45:26.000
A98 341720001:12-09-18
A99 59133626X0
                            </pre>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-layout>
              </v-flex>
              <v-flex xs2>
                <v-layout align-center justify-center column fill-height>
                  <v-btn color="error" fab large dark>
                    <v-icon>navigate_before</v-icon>
                  </v-btn>
                  <span>Notice précedente</span>
                  <br />
                  <v-btn color="error" fab large dark>
                    <v-icon>navigate_next</v-icon>
                  </v-btn>
                  <span>Notice suivante</span>
                  <br />
                  <div id="validButton">
                    <v-btn color="green" fab large dark>
                      <v-icon>done</v-icon>
                    </v-btn>
                    <br />
                    <span>Lancer le traitement</span>
                  </div>
                </v-layout>
              </v-flex>
              <v-flex xs5>
                <v-layout fill-height xs5>
                  <v-card class="elevation-8">
                    <v-container fill-height fluid pa-2>
                      <v-layout fill-height>
                        <v-flex xs12 align-end flexbox>
                          <span class="headline --text">Après</span>
                          <div>
                            <pre>
930 ##$b341720001$jg
A97 25-04-18 11:50:11.000
A98 341720001:25-04-18
A99 591185806

930 ##$b341720001$jg
A97 25-04-18 11:50:22.000
A98 341720001:25-04-18
A99 591185814

930 ##$b341720001$jg
A97 25-04-18 14:23:12.000
A98 341720001:25-04-18
A99 591185822

930 ##$b341720001$jg
A97 12-09-18 16:45:26.000
A98 341720001:12-09-18
A99 59133626X0

930 ##$b341720001$jg
A97 12-09-18 16:45:26.000
A98 341720001:12-09-18
A99 59133626X0

930 ##$b341720001$jg
A97 12-09-18 16:45:26.000
A98 341720001:12-09-18
A99 59133626X0
                            </pre>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    data() {
      return {};
    },
    methods: {}
  };
</script>

<style scoped>
  pre {
    text-align: left !important;
    white-space: pre-wrap; /* Since CSS 2.1 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
  }
  .v-card {
    width: 100%;
  }
  #validButton {
    position: absolute;
    bottom: 20px;
  }
  #demInfos {
    margin-bottom: 10px;
    text-align: left;
  }
</style>

