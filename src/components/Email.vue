<template>
  <v-card class="elevation-5">
    <v-card-title>
      <span class="font-weight-black" v-if="!email">Première connexion</span>
      <span v-else>Modifier son Email</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <span>
          Votre adresse mail est obligatoire pour utiliser l'application. Pour ajouter plusieurs adresses mail, séparez-les par des points virgules ;
        </span>
        <v-text-field
          prepend-inner-icon="mdi-email-outline"
          class="pt-12"
          type="email"
          name="email"
          id="email"
          v-model="emailModel"
          :rules="rules"
          @keyup.enter="validate()">
        </v-text-field>
      </v-form>
      <v-alert
        v-if="messageError"
        type="error"
        title="Erreur"
        :text="messageError"
      ></v-alert>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="info"
        variant="flat"
        :disabled="isDisabled"
        @click="validate()">Valider</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import {onMounted, ref, watch} from 'vue';
import demandesService from '@/service/DemandesService';

const emits = defineEmits(['validate']);
const props = defineProps({
  email: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

const emailModel = ref();
const isDisabled = ref(true);
const pattern = /^((([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))[;]?)+$/;
const rules = ref([
  value => {
    if (value) {
      isDisabled.value = false;
      return true;
    }
    isDisabled.value = true;
    return 'Champ obligatoire.';
  },
  value => {
    if (pattern.test(value)) {
      isDisabled.value = false;
      return true;
    }
    isDisabled.value = true;
    return 'mail(s) invalide'
  }
]);
const messageError = ref();

onMounted(() => {
  emailModel.value = props.email;
});

function validate() {
  demandesService.modifierEmail(props.userId, emailModel.value)
    .then(result => {
      emits('validate', result.data.email);
    })
    .catch(err => {
      messageError.value = err.response.data.message;
      throw err;
    });
}
</script>
