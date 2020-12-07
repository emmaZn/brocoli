<template>
  <div>
      
      <v-text-field
          v-model="address.road"
          label="Rue"
          
        ></v-text-field>
        <v-text-field
          v-model="address.zip"
          label="Code postal"
          
        ></v-text-field>
         <v-autocomplete
              v-model="address.id_department"
              :items="departments"
              :item-text="(item) => item.code + ' - ' + item.nom"
              :item-value="(item) => item.id_department"
              chips
              label="Departement"
              
            ></v-autocomplete>
      <v-btn color="primary" class="mr-4" @click="update()"> Modifier</v-btn>

  </div>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
      address: {},
      id : null,
      departments: [],
      required: [(v) => !!v || "requis"],
      object: {
        departmentsId: "",
        road: "",
        zip: ""
      },
    }
    
  },
  mounted() {
    this.id = this.$store.state.addrCustomerId
    // recupere les donnes de l'adresse selectionné
    let url = `http://localhost:5000/addrCustomer/${this.id}`
    axios
      .get(url)
      .then((response) => {
        if (response.data) {
          console.log("Address", response.data)
          this.address = response.data

        }
      })
      .catch((error) => {
        console.log("ERREUR", error)
      })
    // recupere la liste des departements
    url = "http://localhost:5000/departments";
    axios
      .get(url)
      .then((response) => {
        // console.log("Departements", response.data);
        this.departments = response.data;
      }) //c'est un objet
      .catch((error) => console.log(console.log("Departments error ", error)));
  },
  methods: {
    // met a jour l'addresse selectionné et redirigie vers le dashboard
    update() {
      let url = `http://localhost:5000/addrCustomer/${this.id}`
      console.log(url)
      axios
        .put(url, {
          road: this.address.road,
          zip: this.address.zip,
          id_department: this.address.id_department,
        })
        .then((response) => {
          if (response.data) {
            // console.log("Address", response.data)
            this.address = response.data
          }
        })
        .catch((error) => {
          console.log("ERREUR", error)
        })
      this.$store.commit("removeAddrCustomer")
      this.$router.push("/client/dashboard")
    }
  }
}
</script>

<style>

</style>