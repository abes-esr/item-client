<template>
  <v-layout align-center justify-center>
    <v-flex md7>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Modifier les informations de votre compte</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <span v-if="emailSaved==null">          
                Votre adresse e-mail est obligatoire pour utiliser l'application :
            </span>
            <span v-else>          
                Votre adresse e-mail actuelle est : {{emailSaved}}
            </span>
            <v-text-field prepend-icon="email" type="email" name="email1" v-model="input.email1" placeholder="Adresse e-mail" required />
            Confirmer votre adresse e-mail : 
            <v-text-field prepend-icon="email" type="email" name="email2" v-model="input.email2" placeholder="Confirmer votre adresse e-mail" required />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" v-on:click="majProfil()">Valider</v-btn>
        </v-card-actions>
      </v-card>
      <v-alert :value="alert" type="error" transition="scale-transition">
        Adresse e-mail incorrecte.
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
        emailSaved:sessionStorage.getItem("email"),
        input: {
          email1:"",
          email2:""
        },
        alert: false
      };
    },
    methods: {
      majProfil() {
        alert = false;
        if (this.input.email1 !== "" && this.input.email2 !== "") {
          if (
            this.input.email1 === this.input.email2 
            &&
            validateEmail(this.input.email1)
          ) {
            axios({
                  headers: { Authorization: sessionStorage.getItem("jwt") },
                  method: "PUT",
                  url: process.env.ROOT_API + "utilisateurs/" + sessionStorage.getItem("usernum"),
                  data:
                  {
                    email: this.input.email1,
                    numUser: sessionStorage.getItem("usernum")                  
                  }
                }).then(
                      result => {                        
                        sessionStorage.setItem("email", result.data.email);                        
                        this.$router.replace({ name: "tab" });                                                                    
                      },
                      error => {
                        console.log(error);                
                        this.alertMessage =
                          "Service indisponible, veuillez réessayer ultérieurement. Si le problème persiste, merci de nous contacter.";              
                        this.alert = true;
                      }
                    );          
          } else {
            this.alert = true;
          }
        } else {
          this.alert = true;
        }
      }
    }
  };

  //Test la validité de la variable email
  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
</script>

<style scoped>
</style>