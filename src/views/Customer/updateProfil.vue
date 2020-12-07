<template>
  <div>
      <h1>Modifie ton profil poto</h1>
      <v-form ref="form" v-model="valid" lazy-validation>

        <v-text-field
            v-model="customer[0].phone"
            :rules="PhoneRules"
            label="Téléphone"
            
            ></v-text-field>
        <v-text-field
            v-model="customer[0].mail"
            :rules="emailRules"
            label="E-mail"
            
            ></v-text-field>
            <v-text-field
                v-model="object.password"
                label="Mot de passe"
                
                :append-icon="value1 ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="() => (value1 = !value1)"
                :type="value1 ? 'password' : 'text'"
                ></v-text-field>
            <v-text-field
                v-model="object.repassword"
                label="Confirmation mot de passe"
                
                :append-icon="value2 ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="() => (value2 = !value2)"
                :type="value2 ? 'password' : 'text'"
                ></v-text-field>
                <v-card v-if="message" dark color="warning">
                  <v-card-text>{{ message }}</v-card-text>
                </v-card>
            <v-btn color="primary" class="mr-4" @click="update()"> Modifier</v-btn>
      </v-form>

  </div>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
        valid: false,
        value1: String,
        value2: String,
        id : null,
        message: "",
        customer: [{
            phone : "",
            mail : ""
        }],
        required: [(v) => !!v || "requis"],
        object: {
            password: null,
            repassword: null,
        },
        PhoneRules:[
        (v) => /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/.test(v)|| "Numéro incorrect"
        ],
        emailRules: [
        (v) => !!v || "E-mail requis",
        (v) => /.+@.+\..+/.test(v) || "E-mail non valid",
        ],
    }
    
  },
  mounted() {
    this.id = this.$store.state.customerId
    // recupere les info de l'utilisateur
    let url = `http://localhost:5000/customers/${this.id}`
    axios
      .get(url)
      .then((response) => {
        if (response.data) {
          // console.log("Customer", response.data)
          this.customer = response.data

        }
      })
      .catch((error) => {
        console.log("ERREUR", error)
      })
  },
  methods: {
    // met a jour le profil et redirige vers le dashboard
    update() {
      // verifie les password
      if (this.object.password != this.object.repassword) {
        return (this.message = "Le mot de passe est invalide");
      }
      let url = `http://localhost:5000/customers/${this.id}`
      if (this.$refs.form.validate()) {
        if (this.object.password) {
          axios
            .put(url, {
                mail: this.customer[0].mail,
                phone: this.customer[0].phone,
                password: this.object.password,
            })
            .then((response) => {
            if (response.data) {
                // console.log("customer", response.data)
                this.customer = response.data
            }
            })
            .catch((error) => {
            console.log("ERREUR", error)
            })
        } else {
          axios
            .put(url, {
                mail: this.customer[0].mail,
                phone: this.customer[0].phone,
            })
            .then((response) => {
            if (response.data) {
                // console.log("customer", response.data)
                this.customer = response.data
            }
            })
            .catch((error) => {
            console.log("ERREUR", error)
            })
        }
        
        this.$router.push("/client/dashborad")
      }
    }
  }
}
</script>

<style>

</style>