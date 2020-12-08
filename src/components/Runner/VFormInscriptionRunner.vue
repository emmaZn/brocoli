<template>
  <div class="container">
    <v-form id="form" ref="form" v-model="valid" lazy-validation>
      <div class="text-field-container">
        <div class="name-container">
          <v-row>
            <v-col cols="6">
              <v-text-field
                class=""
                v-model="object.firstname"
                :rules="required"
                label="Prénom"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                class="text-field pl-2"
                v-model="object.lastname"
                :rules="required"
                label="Nom"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <v-text-field
          class="text-field"
          v-model="object.password"
          :rules="required"
          label="Mot de passe"
          required
          :append-icon="value1 ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="() => (value1 = !value1)"
          :type="value1 ? 'password' : 'text'"
        ></v-text-field>
        <v-text-field
          class="text-field"
          v-model="object.repassword"
          :rules="required"
          label="Confirmation mot de passe"
          required
          :append-icon="value2 ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="() => (value2 = !value2)"
          :type="value2 ? 'password' : 'text'"
        ></v-text-field>
        <v-text-field
          class="text-field"
          v-model="object.phone"
          :rules="PhoneRules"
          label="Téléphone"
          required
        ></v-text-field>

        <v-text-field
          class="text-field"
          v-model="object.mail"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>

        <v-autocomplete
          class="text-field"
          v-model="object.departmentsIds"
          :items="departments"
          :item-text="(item) => item.code + ' - ' + item.nom"
          :item-value="(item) => item.id_department"
          chips
          :rules="required"
          required
          label="Lieux de travail"
          multiple
        ></v-autocomplete>
        <span v-if="message" class="alert">
          <img
            id="warning-icon"
            src="../../assets/warning.svg"
            alt="warning logo"
          />{{ message }}</span
        >
        <v-btn rounded color="primary" class="btn-large" @click="register">
          Inscription</v-btn
        >
      </div>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    valid: false,
    value1: String,
    value2: String,
    object: {
      mail: "",
      password: "",
      repassword: "",
      phone: "",
      firstname: "",
      lastname: "",
      image: "",
      departmentsIds: [],
    },
    message: "",
    departments: [],
    PhoneRules: [
      (v) =>
        /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/.test(
          v
        ) || "Numéro incorrect",
    ],
    emailRules: [
      (v) => !!v || "E-mail requis",
      (v) => /.+@.+\..+/.test(v) || "E-mail non valide",
    ],
    required: [(v) => !!v || "requis"],
  }),
  mounted() {
    if (this.$store.state.runnerId) {
      this.$router.push("/partenaire/profil");
    }
    let url = "https://brocoliserver.herokuapp.com/departments";
    axios
      .get(url)
      .then((response) => {
        // console.log("Departements", response.data);
        this.departments = response.data;
      }) //c'est un objet
      .catch((error) => console.log(console.log("Departments error ", error)));
  },

  methods: {
    register() {
      let url = "https://brocoliserver.herokuapp.com/runners/register";
      if (this.object.password != this.object.repassword) {
        return (this.message = "Les mots de passe sont différents ! ");
      }
      if (!this.object.departmentsIds.length) {
        return (this.message =
          "Veuillez rentrer les départements dans lesquels vous travaillez");
      }
      if (this.$refs.form.validate()) {
        axios
          .post(url, {
            mail: this.object.mail,
            password: this.object.password,
            phone: this.object.phone,
            firstname: this.object.firstname,
            lastname: this.object.lastname,
            image: this.object.image,
            departmentsIds: this.object.departmentsIds,
          })
          .then((response) => {
            console.log("INSCRIT", response.data);
            this.$store.commit("loginRunner", response.data.id_runner);
            this.$router.push("/partenaire/profil");
          }) //c'est un objet
          .catch((error) => {
            console.log("PAS INSCRIT", error);
            this.message = "Vous etes déjà inscrit !";
          });
      }
    },
  },
};
</script>

<style lang="scss">
.container {
  background: white;
  width: 70vmin;
  height: 65vh;
  border-radius: 50px;
  margin-top: 4vh;
  z-index: 1;
  box-shadow: 0px 4px 4px 7px rgba(0, 0, 0, 0.1);
}
//text field
.text-field-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1em;
  .text-field {
    width: 60vmin;
    height: 4em;
  }
  .name-container {
    display: flex;
    width: 60vmin;
  }
}
//buttons
.btn-large {
  width: 60vmin;
  margin-top: 3em;
  height: 5vh !important;
}
.alert {
  margin-top: 2em;
  width: 60vmin;
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
