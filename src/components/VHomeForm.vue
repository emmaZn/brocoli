<template>
  <div class="container" v-on:keyup.enter="log()">
    <v-form class="home-form" ref="form" v-model="valid" lazy-validation>
      <div class="text-area-wrapper">
        <v-text-field
          class="textarea"
          label="E-mail :"
          v-model="object.mail"
          :rules="emailRules"
          required
        >
        </v-text-field>
        <v-text-field
          class="textarea"
          label="Mot de passe"
          v-model="object.password"
          :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="() => (value = !value)"
          :type="value ? 'password' : 'text'"
          required
        >
        </v-text-field>
        <a href="" class="forgot-psw">mot de passe oublié ?</a>
      </div>
      <span v-if="message" class="alert ma-auto mt-10">
        <img
          id="warning-icon"
          src="./../assets/warning.svg"
          alt="warning logo"
        />{{ message }}</span
      >
      <div class="btn-wrapper">
        <button class="round sign-in" type="button" @click="log()">
          Connexion
        </button>
        <router-link :to="{ name: 'Inscription Client' }">
          <button type="button" class="round sign-up">Inscription</button>
        </router-link>
      </div>
      <div class="btn-wrapper">
        <router-link :to="{ name: 'Connexion Partenaire' }">
          <button type="button" class="round runner-sign-in">
            Connexion Runner
          </button>
        </router-link>
      </div>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    value: String,
    valid: false,
    message: "",
    object: {
      mail: "",
      password: "",
    },
    emailRules: [
      (v) => !!v || "E-mail requis",
      (v) => /.+@.+\..+/.test(v) || "E-mail non valide",
    ],
    required: [(v) => !!v || "Mot de passe requis"],
  }),
  mounted() {
    if (this.$store.state.customerId) {
      this.$router.push("/client/dashboard");
    }
  },

  methods: {
    log() {
      // const self=this
      let url = "http://localhost:5000/customers/login";
      this.$refs.form.validate();
      axios
        .get(url, {
          params: { mail: this.object.mail, password: this.object.password },
        })
        .then((response) => {
          if (response.data) {
            console.log("CONNECTE", response.data);
            this.$store.commit("loginCustomer", response.data.id_customer);
            this.$router.push("/client/dashboard");
          } else {
            console.log("PAS CONNECTE");
            this.message = "Email et/ou password invalide";
          }
        })
        .catch((error) => {
          console.log("PAS CONNECTE", error);
          this.message = "Email et/ou password invalide";
        });
    },
  },
};
</script>

<style lang="scss" scoped>
//Variables
$color1-btn: #6fce91;

.container {
  background-color: white;
  height: 60vh;
  width: 35em;
  border-radius: 25px;
  box-shadow: 0px 4px 4px 7px rgba(0, 0, 0, 0.1);
  z-index: 1;
  margin-top: 3vh;
  .home-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .btn-wrapper {
      display: flex;
      justify-content: space-around;
      margin-top: 3em;
    }
    .text-area-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-top: 1em;
      margin-left: 2em;
      margin-right: 2em;
    }
  }
}
//buttons
.round {
  font-size: 1.5em;
  height: 2em;
  border-radius: 50px;
  font-family: Monsserrat, sans-serif;
  transition: 300ms;
  outline: none;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.sign-up {
  background-color: $color1-btn;
  border: 2px solid $color1-btn;
  color: white;
  width: 10em;
  transition: 200ms;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  &:hover {
    color: $color1-btn;
    background-color: white;
  }
}
.sign-in {
  border: solid 2px $color1-btn;
  color: $color1-btn;
  width: 10em;
  &:hover {
    color: white;
    background-color: $color1-btn;
  }
}
.runner-sign-in {
  border: solid 2px $color1-btn;
  color: $color1-btn;
  width: 21em;
  justify-self: center;
  margin-top: -1em;
  &:hover {
    color: white;
    background-color: $color1-btn;
  }
}
//textarea
.textarea {
  width: 38em;
  height: 6em;
}
.forgot-psw {
  color: $color1-btn;
  &:hover {
    color: rgb(70, 70, 236);
  }
}
.alert {
  margin-top: 1em;
  width: 30em;
  color: white;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border: solid 1px red;
  padding: 0.2em;
  background-color: red;
  border-radius: 5px;
  #warning-icon {
    width: 1.5em;
    margin-right: 0.5em;
  }
}
</style>