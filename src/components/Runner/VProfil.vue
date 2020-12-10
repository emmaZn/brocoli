<template>
  <div>
    <v-form id="formUpdateProfil" ref="form" v-model="valid" lazy-validation>
      <v-card flat>
        <v-card-text class="profil pa-16">
          <h2>{{ runner.lastname }} {{ runner.firstname }}</h2>
          <v-text-field v-model="newRunner.mail" label="E-mail" :disabled="!editMode" :rules="emailRules">
          </v-text-field>
          <v-text-field v-model="newRunner.phone" label="Téléphone" :disabled="!editMode" :rules="PhoneRules">
          </v-text-field>
          <span v-if="!editMode">
            Lieux de travail :
            <v-chip v-for="delivery in runner.deliveries" :key="delivery.id_department" class="ma-2">
              {{ delivery.code }} - {{ delivery.nom }}
            </v-chip></span>
          <v-autocomplete v-else v-model="newRunner.departmentsIds" :items="departments"
            :item-text="(item) => item.code + ' - ' + item.nom" :item-value="(item) => item.id_department" chips
            required label="Lieux de travail" multiple></v-autocomplete>
          <v-text-field v-if="editMode" v-model="newRunner.password" label="Nouveau mot de passe"
            :append-icon="value1 ? 'mdi-eye-off' : 'mdi-eye'" @click:append="() => (value1 = !value1)"
            :type="value1 ? 'password' : 'text'"></v-text-field>
          <v-text-field v-if="editMode" v-model="newRunner.repassword" label="Confirmation du mot de passe"
            :append-icon="value2 ? 'mdi-eye-off' : 'mdi-eye'" @click:append="() => (value2 = !value2)"
            :type="value2 ? 'password' : 'text'"></v-text-field>
          <v-card v-if="message" dark color="warning"> {{ message }}</v-card>
        </v-card-text>

        <v-card-actions class="icon">

          <v-btn icon class="ma-2">
            <v-icon v-if="!editMode" large color="primary" @click="edit()">mdi-pen</v-icon>
          </v-btn>
          <v-btn icon class="ma-2">
            <v-icon v-if="editMode" large color="primary" @click="updateRunner">mdi-check-bold</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    props: {
      runner: {},
    },
    data: () => ({
      value1: String,
      value2: String,
      editMode: false,
      valid: false,
      message: "",
      departments: [],
      newRunner: {
        mail: "",
        phone: "",
        password: "",
        repassword: "",
      },
      PhoneRules: [
        (v) =>
        /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/
        .test(v) || "Numéro incorrect"
      ],
      emailRules: [
        (v) => !!v || "E-mail requis",
        (v) => /.+@.+\..+/.test(v) || "E-mail non valide",
      ],
    }),
    mounted() {
      this.newRunner = this.runner;
      this.newRunner.password = "";
      this.newRunner.repassword = "";
      this.newRunner.departmentsIds = []
      this.newRunner.deliveries.forEach((delivery) => {
        this.newRunner.departmentsIds.push(delivery.id_department);
      });
    },
    methods: {
      edit() {
        let url = "http://brocoliserver.herokuapp.com/departments";
        axios
          .get(url)
          .then((response) => {
            console.log("Departements", response.data);
            this.departments = response.data;
            this.editMode = true;
          }) //c'est un objet
          .catch((error) => console.log("Departments error ", error));
      },
      updateRunner() {
        if (this.newRunner.password !== this.newRunner.repassword) {
          return (this.message = "Le mot de passe est invalide");
        }
        if (!this.newRunner.departmentsIds.length) {
          return (this.message = "Veuillez rentrer les départements dans lesquels vous travaillez");
        }
        this.$emit("update", this.runner);
        this.editMode = false;
      },
    },
  };
</script>

<style scoped>
  @media screen and (max-width: 600px) {
    .v-card__text {
      padding: 30px !important;
    }

    .icon {
      display: flex;
      justify-content: space-between;
    }
  }
</style>