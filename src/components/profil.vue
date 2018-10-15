<template>
  <v-layout align-center justify-center>
    <v-flex md7>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title v-if="user.email==null">Première connexion</v-toolbar-title>
          <v-toolbar-title v-else>Modifier les informations de votre compte</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <span v-if="user.email==null">          
                Votre adresse e-mail est obligatoire pour utiliser l'application :
            </span>
            <span v-else>          
                Votre adresse e-mail actuelle est : {{user.email}}
            </span>
            <v-text-field prepend-icon="email" type="email" name="email1" v-model="input.email1" placeholder="Adresse e-mail" :rules="[rules.required, rules.email]" />
            Confirmer votre adresse e-mail : 
            <v-text-field prepend-icon="email" type="email" name="email2" v-model="input.email2" placeholder="Confirmer votre adresse e-mail" :rules="[rules.required, rules.email]" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" v-on:click="majProfil()">Valider</v-btn>
        </v-card-actions>
      </v-card>
      <v-alert :value="alert" type="error" transition="scale-transition">
        Adresse e-mail vide ou différente
      </v-alert>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from "axios";
  export default {
    name: "Profil",
    data() {
      return {
        valid: true,
        input: {
          email1:"",
          email2:""
        },
        alert: false,
        user: {},
        rules: {
          required: value => !!value || "Champ obligatoire.",
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || "e-mail invalide"
          }
        }
      };
    },
    mounted() {
      this.user = JSON.parse(sessionStorage.getItem("user"));
    },
    methods: {
      majProfil() {
        alert = false;   

        if (this.$refs.form.validate() && this.input.email1==this.input.email2) {        
            axios({
                  headers: { Authorization: this.user.jwt },
                  method: "PUT",
                  url: process.env.ROOT_API + "utilisateurs/" + this.user.userNum,
                  data:
                  {
                    email: this.input.email1,
                    numUser: this.user.userNum                 
                  }
                }).then(
                      result => {                        
                        this.user.email=result.data.email;
                        sessionStorage.setItem("user", JSON.stringify(this.user));                        
                        this.$router.replace({ name: "tab" });                                                                    
                      },
                      error => {               
                        this.alertMessage =
                          "Service indisponible, veuillez réessayer ultérieurement. Si le problème persiste, merci de nous contacter.";              
                        this.alert = true;
                      }
                    );          
          } 
          else {
            this.alert = true;
          }
      }
    }
  };
</script>

<style scoped>
</style>