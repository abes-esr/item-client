<template>
    <div id="login">
        <h1>Login</h1>
        <input type="text" name="username" v-model="input.username" placeholder="Username" required/>
        <input type="password" name="password" v-model="input.password" placeholder="Password" required/>
        <button type="button" v-on:click="login()">Login</button>
    </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      input: {
        authenticated: false,
        username: "",
        password: ""
      }
    };
  },
  methods: {
    login() {
      if (this.input.username !== "" && this.input.password !== "") {
        if (
          this.input.username === this.$parent.mockAccount.username &&
          this.input.password === this.$parent.mockAccount.password
        ) {
          this.$emit("authenticated", true);
          sessionStorage.setItem("user", this.input.username);
          sessionStorage.setItem("jwt", this.input.username);
          this.authenticated = true;

          if (sessionStorage.getItem("jwt") !== null) {
            this.$router.replace({ name: "hello" });
          }
        } else {
          alert("The username and / or password is incorrect");
        }
      } else {
        alert("A username and password must be present");
      }
    }
  }
};
</script>

<style scoped>
</style>
