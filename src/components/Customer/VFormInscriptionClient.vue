<template>
  <div class="container">
    <v-form id="form" ref="form" v-model="valid" lazy-validation>
      <div class="text-field-container">
        <div class="name-container">
          <v-row>
            <v-col cols="6" class="py-0">
              <v-text-field v-model="object.firstname" :rules="required" label="Prénom" required></v-text-field>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-text-field class="text-field pl-2" v-model="object.lastname" :rules="required" label="Nom" required>
              </v-text-field>
            </v-col>
          </v-row>
        </div>
        <v-text-field class="text-field" v-model="object.phone" :rules="PhoneRules" label="Téléphone" required>
        </v-text-field>
        <v-text-field class="text-field" v-model="object.mail" :rules="emailRules" label="E-mail" required>
        </v-text-field>
        <div class="name-container">
          <v-row>
            <v-col cols="12" md="6" lg="6" sm="6" class="py-0">
              <v-text-field class="text-field" v-model="object.password" :rules="required" label="Mot de passe" required
                :append-icon="value1 ? 'mdi-eye-off' : 'mdi-eye'" @click:append="() => (value1 = !value1)"
                :type="value1 ? 'password' : 'text'"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" lg="6" sm="6" class="py-0">
              <v-text-field class="text-field" v-model="object.repassword" :rules="required"
                label="Confirmation mot de passe" required :append-icon="value2 ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="() => (value2 = !value2)" :type="value2 ? 'password' : 'text'"></v-text-field>
            </v-col>
          </v-row>
        </div>
        <div>
          
          <v-text-field class="road text-field" list="road" v-model.lazy="object.road" @input="search()"
            :rules="required" label="Rue" required></v-text-field>
          <datalist id="road">

          </datalist>

        </div>
        <v-text-field  class="text-field" v-model="object.zip" :rules="codePostalRules" label="Code postal" required>
        </v-text-field>
        <v-autocomplete  class="text-field" v-model="object.departmentsId" :items="departments"
          :item-text="(item) => item.code + ' - ' + item.nom" :item-value="(item) => item.id_department" chips
          :rules="required" required label="Departement"></v-autocomplete>
        <span v-if="message" class="alert">
          <img id="warning-icon" src="../../assets/warning.svg" alt="warning logo" />{{ message }}
        </span>
        <v-btn rounded color="primary" class="btn-large" @click="register"> Inscription</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
  import axios from "axios"

  export default {
    data: () => ({
      apiUrl: "https://api-adresse.data.gouv.fr/search/?q=",
      limit: "&limit=15",
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
        departmentsId: "",
        road: "",
        zip: ""
      },
      message: "",
      departments: [],
      roads: [],
      PhoneRules: [
        (v) =>
        /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/
        .test(v) || "Numéro incorrect"
      ],
      emailRules: [
        (v) => !!v || "E-mail requis",
        (v) => /.+@.+\..+/.test(v) || "E-mail non valide",
      ],
      codePostalRules: [
        (v) => /^(([0-8][0-9])|(9[0-5]))[0-9]{3}$/.test(v) || "Code Postal Valide",
      ],
      required: [(v) => !!v || "requis"],
    }),
    mounted() {
      //Verifie si l'utilisateur est deja log 
      if (this.$store.state.customerId) {
        // this.$router.push("/client/profil")
        console.log('already Log')
      }
      // recupere la liste des departements
      let url = "http://brocoliserver.herokuapp.com/departments"
      axios
        .get(url)
        .then((response) => {
          // console.log("Departements", response.data)
          this.departments = response.data
        }) //c'est un objet
        .catch((error) => console.log(console.log("Departments error ", error)))

      // this.search()
      // document.querySelector('road').on
    },

    methods: {
      // inscrit un utilisateur, stocke la variable global, redirige vers le dashboard
      register() {
        // Verfiie si les password sont identiques
        if (this.object.password != this.object.repassword) {
          return (this.message = "Le mot de passe est invalide");
        }
        // fait appel a l'api pour enregistrer un user
        let url = "http://brocoliserver.herokuapp.com/customers/register"
        if (this.$refs.form.validate()) {
          axios
            .post(url, {
              mail: this.object.mail,
              password: this.object.password,
              phone: this.object.phone,
              firstname: this.object.firstname,
              lastname: this.object.lastname,
              image: this.object.image,
              id_department: this.object.departmentsId,
              road: this.object.road,
              zip: this.object.zip
            })
            .then((response) => {
              console.log("INSCRIT", response)
              this.$store.commit("loginCustomer", response.data.id)
              this.$router.push("/client/dashboard")
            }) //c'est un objet
            .catch((error) => {
              console.log("PAS INSCRIT", error)
              this.message = "Vous etes déjà inscrit !"
            })
        }
      },
      search() {
        // let road = this.object.road
        // this.object.road.onchange = function() {
        //   console.log('heelo')
        // }
        // docu.addEventListener("change", console.log('hello'));
        // console.log(this.object.road)
        this.roads = []
        let url = this.apiUrl + this.object.road
        console.log(url)
        fetch(url)
          .then(response => response.json())
          .then(results => {
            // console.log(results.features)
            results.features.forEach(result => {
              // console.log(result.properties)
              this.roads.push(result.properties)
            });
            console.log(this.roads)
            // this.roads = results.features
          })
      },

    },
  }
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
  // .name {
  //   padding: 0!important;
  // }
  //text field
  .text-field-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1em;

    .text-field {
      width: 60vmin;
      height: 3em;
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

  @media screen and (max-width: 420px) and (max-height:740px) {
    .container {
      background-color: white;
      height: 100vh;
      width: 20em;
      border-radius: 50px;
      box-shadow: 0px 4px 4px 7px rgba(0, 0, 0, 0.1);
      z-index: 1;
      margin-top: 1vh;
    }
    
  }

  @media screen and (max-width: 375px) and (max-height:812px) {
    //iphone X
  }
</style>