import axios from "axios";

export default {
  data() {
    return {
      result: ""
    };
  },
  mounted() {
    this.user = JSON.parse(sessionStorage.getItem("user"));
  },
  methods: {
    //Attention, ne retourne pas vraiment la valeur mais une Promise, à résoudre ensuite
    async checkEtatDemande(numDem) {
      return await axios({
        headers: { Authorization: this.user.jwt },
        method: "GET",
        url:
          process.env.ROOT_API + "demandes/" + numDem
      }).then(
        result => {
          return result.data.etatDemande.numEtat;
        },
        error => {
          if (error.response.status == 401) {
            this.$emit("logout");
          }
        }
      )
    }
  }
}