<template>
  <div>
      <v-form ref="form" v-model="valid" lazy-validation>

        <v-text-field
            v-model="object.road"
            :rules="required"
            label="Rue"
            required
            ></v-text-field>
            <v-text-field
            v-model="object.zip"
            :rules="CodePostalRules"
            label="Code Postal"
            required
            ></v-text-field>
            <v-autocomplete
                v-model="object.id_department"
                :items="departments"
                :item-text="(item) => item.code + ' - ' + item.nom"
                :item-value="(item) => item.id_department"
                chips
                :rules="required"
                required
                label="Departement"
                
                ></v-autocomplete>
        <v-btn color="error" class="mr-4" @click="add()"> Ajouter</v-btn>

      </v-form>
            
  </div>
</template>

<script>
import axios from "axios"

export default {
    data() {
        return {
            valid: false,
            message: "",
            departments: [],
            object: {
                id_department: "",
                road: "",
                zip: "",
            },
            CodePostalRules:[
                (v) => /^(([0-8][0-9])|(9[0-5]))[0-9]{3}$/.test(v) || "Code Postal Valide", 
            ], 
            required: [(v) => !!v || "requis"],

        }
    },
    mounted() {
        //recupere la liste des departements
        let url = "http://localhost:5000/departments"
        axios
        .get(url)
        .then((response) => {
            // console.log("Departements", response.data)
            this.departments = response.data
        }) //c'est un objet
        .catch((error) => console.log(console.log("Departments error ", error)))
    },
    methods: {
        //ajoute une adresse et redirige vers le dashboard
        add() {
            // fait appel a la requete add de l'api
            let url = "http://localhost:5000/addrCustomer/add"
            console.log(this.object)
            if (this.$refs.form.validate()) {
                axios
                .post(url, {
                    road: this.object.road,
                    zip: this.object.zip,
                    id_department: this.object.id_department,
                    id_customer: this.$store.state.customerId
                })
                .then(() => {
                    // console.log("Ajouter", response)
                    this.$router.push("/client/dashboard")
                })
                 //c'est un objet
                .catch((error) =>{
                    console.log("PAS Ajouter:", error)
                    this.message = "Erreur"
                })
            }

        }
    },
}
</script>

<style>

</style>