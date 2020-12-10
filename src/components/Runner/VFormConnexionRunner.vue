<template>
  <div class="container">
    <v-form class="form" ref="form" v-model="valid" lazy-validation>
      <div class="text-field-wrapper">
        <v-text-field
          class="text-field"
          v-model="object.mail"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>
        <v-text-field
          class="text-field"
          v-model="object.password"
          :rules="required"
          label="Mot de passe"
          :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="() => (value = !value)"
          :type="value ? 'password' : 'text'"
          required
        ></v-text-field>

        <span v-if="message" class="alert">
          <img
            id="warning-icon"
            src="../../assets/warning.svg"
            alt="warning logo"
          />{{ message }}</span
        >
        <button class="btn-sign-in" type='button' color="secondary" dark @click="log">Connexion</button>
      </div>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    valid: false,
    value: String,
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
    if (this.$store.state.runnerId) {
      this.$router.push("/partenaire/profil");
    }
  },
  methods: {
    log() {
      let url = "http://brocoliserver.herokuapp.com/runners/login";
      this.$refs.form.validate();
      axios
        .get(url, {
          params: { mail: this.object.mail, password: this.object.password },
        })
        .then((response) => {
          if (response.data) {
            console.log("CONNECTE", response.data);
            this.$store.commit("loginRunner", response.data.id_runner);
            this.$router.push("/partenaire/profil");
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
@media screen and (max-width:767px){
  .container{ 
  width: 98vw!important;
  height: 70vh !important;
    
    .btn-wrapper {
      margin-top: 1em !important;
    }
  }

  .round{
    width: 35vw !important; 
    height: 6vh;
    font-size: 20px!important;
  }

.runner-sign-in {
  width: 78vw !important;
  margin-top: -111em;
 
  }

  .alert {
  margin-top: 1em;
  width: 16em !important;
  padding: 0.2em;
  position: center;
  #warning-icon {
    width: 1.5em;
    margin-right: 0.5em;
    }
  }
}


.container {
  background-color: white;
  height: 50vh;
  width: 35em;
  border-radius: 50px;
  box-shadow: 0px 4px 4px 7px rgba(0, 0, 0, 0.1);
  z-index: 1;
  margin-top: 5vh;
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 2em;
    .text-field-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-content: center;
      margin-top: 1em;
      margin-left: 2em;
      margin-right: 2em;
    }
  }
}
//buttons
.btn-sign-in {
font-size: 1.5em;
  height: 2em;
  border-radius: 50px;
  font-family: Monsserrat, sans-serif;
  outline: none;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: rgba(111, 206, 145, 1);
  color: white; 
  margin-top: 2em;
  &:hover{
  background-color:white;
  border:solid 2px rgba(111, 206, 145, 1); 
  color: rgba(111, 206, 145, 1); 
  }
}
//textarea
.text-field {
  width: 38em;
  height: 6em;
}
// .forgot-psw {
//   color: $color1-btn;
//   &:hover {
//     color: rgb(70, 70, 236);
//   }
// }
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
