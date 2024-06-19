<template>
  <v-card class="elevation-12">
    <v-card-title>
      <span v-if="!email">Première connexion</span>
      <span v-else>Modifier son Email</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <span>
          Votre adresse mail est obligatoire pour utiliser l'application. Pour ajouter plusieurs adresses mail, séparez-les par des points virgules ;
        </span>
        <v-text-field
          type="email"
          name="email"
          id="email"
          v-model="emailModel"
          :rules="rules"
          @keyup.enter="validate()">
        </v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="info" :disabled="isDisabled" @click="validate()">Valider</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
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
    if (value) return true;
    return 'Champ obligatoire.';
  },
  value => {
    if (pattern.test(value)) return true;
    return 'mail(s) invalide'
  }
]);

onMounted(() => {
  emailModel.value = props.email;
});

function validate() {
  demandesService.modifierEmail(props.userId, emailModel.value)
    .then(result => {
      emits('validate', result.data.email);
    });
}

watch(emailModel.value, (newValue) => {
  isDisabled.value = !rules.value.every(rule => rule(newValue)); // Check all rules
});
</script>
