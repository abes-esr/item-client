<template>
    <div id="listeRCR">
        <label>Séléction du RCR</label>
        <select v-model="selected">
            <option v-for="lib in listRcr" v-bind:key="lib.library.rcr" v-bind:value="lib.library.rcr">{{ lib.library.name}} - {{ lib.library.rcr }}</option>
        </select>
        <button type="button" v-on:click="selectRCR()">C'est ti-par</button>
    </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Rcr",
  data() {
    return {
      listRcr: "",
      selected: ""
    };
  },
  mounted() {
    axios({
      method: "GET",
      url: "https://www.idref.fr/services/iln2rcr/5&format=text/json"
    }).then(
      result => {
        this.listRcr = result.data.sudoc.query.result;
      },
      error => {
        console.error(error);
      }
    );
  },
  methods: {
      selectRCR(){
          console.log(this.selected)
      }
  }
};
</script>

<style scoped>
</style>
