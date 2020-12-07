<template>
    <div class="container">
    <h1>Mon Profile</h1>
    <p>Prénom : {{customers[0].firstname}}</p>
    <p>Nom : {{customers[0].lastname}} </p>
    <p>E-mail : {{customers[0].mail}} </p>
    <p>Nom : {{customers[0].lastname}} </p>
    
    <v-btn color="primary" class="mr-4" @click="updateProfil()"> Modifier Profil</v-btn>
    </div>
</template>

<script>
import axios from "axios"
export default { 
    
  data() {
    return {
      valid: false,

      message: "",
      customers: [{
        firstname : "",
        lastname : ""
      }],
      id : null,
      id_department: 1,
      required: [(v) => !!v || "requis"],
    }
  },
  mounted() {
    // si l'utilisateur est pas connecté rentourne à l'accueil
      this.id = this.$store.state.customerId
      // On recupere les info de l'utilisateur pour pouvoir les afficher
      let url = `http://localhost:5000/customers/${this.id}`
      axios
        .get(url)
        .then((response) => {
          if (response.data) {
            // console.log("ADDRCUSTOMER", response.data)
            this.customers = response.data
            this.search()
          }
        })
        .catch((error) => {
          console.log("ERREUR", error)
        })
        
    },
  methods: {
    // fonction de deconnexion
    logout() {
      this.$store.commit("logoutCustomer")
      this.$router.push("/")
    },
    // fonction pour update un adresse
    updateAddr(id) {
      this.$store.commit("addAddrCustomer", id)
      this.$router.push({ name: 'UpadteAddrClient'})
    },
    // fonction poour modifier le mail, le numero de tel et le password
    updateProfil() {
      this.$router.push({name: 'UpadteProfilClient'})
    },
    // fonction d'ajout d'adresse
    addAddr() {
      this.$router.push({name: 'AddAddrClient'})
    },
    // fonction de suppression d'addresse
    deleteAddr(id) {
      if (this.customers.length <= 1) {
        return (this.message = "Vous devez avoir on moins une adresse")
      }
      axios({
            method: "DELETE",
            url: `http://localhost:5000/addrCustomers/${id}`,
            headers: { "Content-Type": "application/json" },
          }) 
      this.reloadAddr()    
    },
    reloadAddr() {
      let url = `http://localhost:5000/customers/${this.id}`
      axios
        .get(url)
        .then((response) => {
          if (response.data) {
            // console.log("ADDRCUSTOMER", response.data)
            this.customers = response.data
            this.search()
          }
        })
        .catch((error) => {
          console.log("ERREUR", error)
        })
    },
  },
}
</script>