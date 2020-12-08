<template>
    <div class="container">
        <v-menu-client></v-menu-client>
        <v-profile-infos></v-profile-infos>
        <v-profile-address></v-profile-address>
    </div>
</template>


<script>
import axios from "axios"
import VMenuClient from "@/components/DashboardClient/VMenuClient"
import VProfileAddress from '../../../components/DashboardClient/VProfileAddress.vue'
import VProfileInfos from '../../../components/DashboardClient/VProfileInfos.vue'
export default {
  name: "dashboard",
  components : {
    VMenuClient,
    VProfileAddress,
    VProfileInfos
  }, 

  data() {
    VMenuClient
    return {
      valid: false,

      message: "",
      customers: [{
        firstname : "",
        lastname : ""
      }],
      commande: [{
        id_runner: null,
        id_address: null,
        id_product: null,
        date: null,
        quantity: null,
        prix: null,
        max_quantity:null,
        name_product:'',
        prix_init: null,
      }],
      id : null,
      id_department: 1,
      runners: [],
      dialog: false,
      // required: [(v) => !!v || "requis"],
    }
  },
  mounted() {
    // si l'utilisateur est pas connecté rentourne à l'accueil
    if (!this.$store.state.customerId) {
      this.$router.push("/")
    } else {
      this.id = this.$store.state.customerId
      // On recupere les info de l'utilisateur pour pouvoir les afficher
      let url = `https://brocoliserver.herokuapp.com/customers/${this.id}`
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
        
    }
    
    // this.findAddr()
    let today = new Date()
    let dd = today.getDate()
    let mm = today.getMonth()+1 
    let yyyy = today.getFullYear()
    let hh = today.getHours()
    let m = today.getMinutes()
    let ss = today.getSeconds()
    if(dd<10) {
        dd='0'+dd
    } 
    if(mm<10) {
        mm='0'+mm
    }
    if(hh<10) {
        hh='0'+hh
    } 
    if(m<10) {
        m='0'+m
    }
    if(ss<10) {
        ss='0'+ss
    } 
    this.commande.date = yyyy+'-'+mm+'-'+dd+' '+hh+':'+m+':'+ss
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
            url: `https://brocoliserver.herokuapp.com/addrCustomers/${id}`,
            headers: { "Content-Type": "application/json" },
          }) 
      this.reloadAddr()    
    },
    reloadAddr() {
      let url = `https://brocoliserver.herokuapp.com/customers/${this.id}`
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
    search() {
      let url = `https://brocoliserver.herokuapp.com/runners/from/${this.customers[0].id_department}`
      axios
        .get(url)
        .then((response) => {
          if (response.data) {
            // console.log("RUNNERs", response.data)
            this.runners = response.data
          }
        })
        .catch((error) => {
          console.log("ERREUR", error)
        })
    },
    commander(produit , runner) {
      this.commande.name_product = produit.label
      this.commande.id_product = produit.id_product
      this.commande.max_quantity = produit.stock
      this.commande.prix_init = produit.price
      this.commande.id_runner = runner
      this.dialog = true
    },
    orderPruduct() {

      // console.log('ADRESSE ', this.commande.id_address)
      let url = "https://brocoliserver.herokuapp.com/orders/add"
      if (this.$refs.form.validate()) {
        axios
          .post(url, {
            id_runner: this.commande.id_runner, 
            id_customer: this.$store.state.customerId,
            id_address: this.commande.id_address, 
            id_product: this.commande.id_product, 
            date: this.commande.date, 
            workflow: 'En attente',
            qtte: this.commande.quantity, 
            prix: this.commande.prix 
          })
          .then((response) => {
            console.log("COMMANDE", response)
            //faire une fonction reload
          }) 
          .catch((error) =>{
            console.log("PAS COMMANDE", error)
            this.message = "bug commande"
          })
      
        // if (this.) {}
        url = `https://brocoliserver.herokuapp.com/productsOrder/${this.commande.id_product}`
        axios
          .put(url, {
            id: this.commande.id_product,
            stock: this.commande.quantity,
          })
          .then((response) => {
            if (response.data) {
              console.log("PRODUCT ", response.data)
              // this.address = response.data
            }
          })
          .catch((error) => {
            console.log("ERREUR", error)
          })
      }
    },
  },
}
</script>