<template>
  <div class="container">
    
    
    <h1>Mes adresses</h1>
   
    <v-dialog v-model="dialog1" persistent>
      <template v-slot:activator="{ on, attrs }">
         <v-btn color="primary" class="mr-4" v-bind="attrs" v-on="on">
      Ajouter un adresse de livraison</v-btn>
      </template>
      <v-card><h1>test</h1></v-card>
    </v-dialog>
    
    <!-- Début du v-for -->
    <div
      class="addresses-container"
      v-for="customer of customers"
      :key="customer.id_address"
    >
      <p>{{ customer.road }} {{ customer.zip }} {{ customer.nom }}</p>
      <v-btn
        color="error"
        class="mr-4"
        @click="deleteAddr(customer.id_address)"
      >
        Supprimer</v-btn
      >

      <v-dialog class="update-form" v-model="dialog" persistent>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">Modifier</v-btn>
        </template>
        <v-card>
          <v-text-field v-model="address.road" label="Rue"></v-text-field>
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
          <v-btn color="primary" class="mr-4" @click="update(),dialog=false" >
            Modifier</v-btn
          >
          <v-btn
              color="blue darken-1"
              text
              @click="dialog = false"
            >Fermer</v-btn>
        </v-card>
      </v-dialog>
    </div>
  
  
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dialog:false, 
      dialog1:false, 
      valid: false,
      address: {},
      message: "",
      departments: [],
      customers: [
        {
          firstname: "",
          lastname: "",
        },
      ],
      id: null,
      id_department: 1,
      required: [(v) => !!v || "requis"],
    };
  },
  mounted() {
    // si l'utilisateur est pas connecté rentourne à l'accueil
    this.id = this.$store.state.customerId;
    console.log(this.address)
    // On recupere les info de l'utilisateur pour pouvoir les afficher
    let url = `http://localhost:5000/customers/${this.id}`;
    axios
      .get(url)
      .then((response) => {
        if (response.data) {
          // console.log("ADDRCUSTOMER", response.data)
          this.customers = response.data;
          this.search();
        }
      })
      .catch((error) => {
        console.log("ERREUR", error);
      });

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
    // fonction de deconnexion
    logout() {
      this.$store.commit("logoutCustomer");
      this.$router.push("/");
    },
    // fonction pour update un adresse
    update() {
      let url = `http://localhost:5000/addrCustomer/${this.id}`;
      console.log(url);
      axios
        .put(url, {
          road: this.address.road,
          zip: this.address.zip,
          id_department: this.address.id_department,
        })
        .then((response) => {
          if (response.data) {
            // console.log("Address", response.data)
            this.address = response.data;
          }
        })
        .catch((error) => {
          console.log("ERREUR", error);
        });
      this.$store.commit("removeAddrCustomer");
      document.location.reload(); 
    },
    // fonction poour modifier le mail, le numero de tel et le password
    updateProfil() {
      this.$router.push({ name: "UpadteProfilClient" });
    },
    // fonction d'ajout d'adresse
    addAddr() {
      this.$router.push({ name: "AddAddrClient" });
    },
    // fonction de suppression d'addresse
    deleteAddr(id) {
      if (this.customers.length <= 1) {
        return (this.message = "Vous devez avoir on moins une adresse");
      }
      axios({
        method: "DELETE",
        url: `http://localhost:5000/addrCustomers/${id}`,
        headers: { "Content-Type": "application/json" },
      });
      this.reloadAddr();
    },
    reloadAddr() {
      let url = `http://localhost:5000/customers/${this.id}`;
      axios
        .get(url)
        .then((response) => {
          if (response.data) {
            // console.log("ADDRCUSTOMER", response.data)
            this.customers = response.data;
            this.search();
          }
        })
        .catch((error) => {
          console.log("ERREUR", error);
        });
    },
  },
};
</script>
